"""
Service for processing PDF documents with semantic chunking and detailed location tracking
"""

from typing import List, Dict, Optional
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from ..models.document_pydantic import DocumentChunk
import fitz  # in jungle di giovedi' sera
import re

class PDFProcessingService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            separators=["\n\n", "\n", ".", "!", "?", ";"],
            chunk_size=1500,
            chunk_overlap=400,
            length_function=len,
            add_start_index=True,
        )
        self.min_chunk_length = 100
        self.merge_threshold = 150

    async def process_pdf(self, file_path: str) -> Dict:
        """Process PDF with semantic chunking and detailed location tracking"""
        #TODO: Add it later after you tested the service
        # if self.document_exists(file_path):
        #     print("Document already processed.")
        #     return

        # Load document with Unstructured for better semantic parsing
        loader = UnstructuredPDFLoader(
            file_path,
            mode="elements",
            strategy="fast",
            include_metadata=True
        )
        elements = loader.load()

        # Open with PyMuPDF for location tracking and TOC
        pdf_doc = fitz.open(file_path)
        
        processed_content = {
            'chunks': [],
            'toc': self._extract_toc(pdf_doc),
            'total_pages': len(pdf_doc)
        }

        # Process elements and create semantic chunks
        chunks = await self._create_semantic_chunks(elements, pdf_doc)
        processed_content['chunks'] = chunks

        pdf_doc.close()
        return processed_content

    async def _create_semantic_chunks(
        self, 
        elements: List[Document], 
        pdf_doc: fitz.Document
    ) -> List[DocumentChunk]:
        """Create semantic chunks with detailed metadata"""
        basic_chunks = []
        
        for element in elements:
            cleaned_text = self._clean_text(element.page_content)
            page_num = element.metadata.get('page_number', 1)
            page = pdf_doc[page_num - 1]
            sections = self._identify_sections(page)
            
            # Find exact location in PDF
            text_instances = page.search_for(cleaned_text[:100].strip())
            location_data = {}
            if text_instances:
                rect = text_instances[0]
                location_data = {
                    "bbox": {
                        "x0": rect.x0,
                        "y0": rect.y0,
                        "x1": rect.x1,
                        "y1": rect.y1
                    },
                    "pdf_coordinates": {
                        "page": page_num,
                        "position": [rect.x0, rect.y0]
                    }
                }

            # Skip table-like content
            if self._is_table_content(cleaned_text, location_data):
                continue

            chunks = self.text_splitter.create_documents(
                texts=[cleaned_text],
                metadatas=[element.metadata]
            )

            for i, chunk in enumerate(chunks):
                current_section = self._find_current_section(
                    location_data.get('pdf_coordinates', {}).get('position', [0, 0])[1],
                    sections
                )

                basic_chunks.append({
                    'content': chunk.page_content,
                    'page_number': page_num,
                    'section_title': current_section,
                    'chunk_index': i,
                    'start_offset': chunk.metadata.get('start_index'),
                    'end_offset': chunk.metadata.get('start_index') + len(chunk.page_content),
                    'category': element.metadata.get('category'),
                    'location_data': location_data,
                    'element_type': element.metadata.get('type'),
                    'font_info': element.metadata.get('font_info'),
                    'file_path': pdf_doc.name
                })

        # Merge small chunks with context while preserving location data
        merged_chunks = []
        i = 0
        while i < len(basic_chunks):
            current_chunk = basic_chunks[i]
            
            if self._should_merge_chunks(current_chunk):
                if i + 1 < len(basic_chunks):
                    next_chunk = basic_chunks[i + 1]
                    # Merge content while keeping original location data
                    current_chunk['content'] = f"{current_chunk['content']} {next_chunk['content']}"
                    current_chunk['end_offset'] = next_chunk['end_offset']
                    # Location data from the first chunk is preserved
                    i += 2
                    merged_chunks.append(current_chunk)
                    continue
            
            merged_chunks.append(current_chunk)
            i += 1

        # Process chunks with context
        processed_chunks = []
        for i, chunk_data in enumerate(merged_chunks):
            prev_context = merged_chunks[i-1]['content'] if i > 0 else ""
            next_context = merged_chunks[i+1]['content'] if i < len(merged_chunks)-1 else ""
            
            processed_chunks.append(
                DocumentChunk(
                    content=chunk_data['content'],
                    page_number=chunk_data['page_number'],
                    section_title=chunk_data['section_title'],
                    chunk_index=chunk_data['chunk_index'],
                    start_offset=chunk_data['start_offset'],
                    end_offset=chunk_data['end_offset'],
                    category=chunk_data['category'],
                    location_data=chunk_data['location_data'],
                    element_type=chunk_data['element_type'],
                    font_info=chunk_data['font_info'],
                    file_path=chunk_data['file_path'],
                    context={
                        "previous": prev_context[-200:] if prev_context else None,
                        "next": next_context[:200] if next_context else None,
                    }
                )
            )

        return processed_chunks

    def _clean_text(self, text: str) -> str:
        """Clean text while preserving semantic structure"""
        text = self._remove_headers_footers(text)
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\x00-\x7F]+', '', text)
        text = re.sub(r'(?<=[.!?])\s+', '\n\n', text)
        return text.strip()

    def _identify_sections(self, page: fitz.Page) -> List[Dict]:
        """Identify section headers using font information"""
        sections = []
        blocks = page.get_text("dict")["blocks"]
        
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        if self._is_header(span):
                            sections.append({
                                'title': span['text'],
                                'position': span['origin'][1],
                                'font_size': span['size'],
                                'font_name': span['font']
                            })
        return sections

    def _is_header(self, span: Dict) -> bool:
        """Enhanced header detection using font properties"""
        return (
            span['size'] > 12 and  # Larger font
            len(span['text'].strip()) < 100 and  # Not too long
            span['text'].strip() and  # Not empty
            not span['text'].isdigit()  # Not just a number
        )

    def _extract_toc(self, doc: fitz.Document) -> List[Dict]:
        """Extract table of contents with page numbers"""
        toc = doc.get_toc()
        return [{'level': level, 'title': title, 'page': page} 
                for level, title, page in toc]

    def _find_current_section(self, y_position: float, sections: List[Dict]) -> Optional[str]:
        """Find section title based on vertical position"""
        current_section = None
        for section in sections:
            if section['position'] <= y_position:
                current_section = section['title']
            else:
                break
        return current_section

    def _remove_headers_footers(self, text: str) -> str:
        """Remove headers and footers while preserving content"""
        lines = text.split('\n')
        if len(lines) > 2:
            if self._is_header_footer(lines[0]):
                lines = lines[1:]
            if self._is_header_footer(lines[-1]):
                lines = lines[:-1]
        return '\n'.join(lines)

    def _is_header_footer(self, line: str) -> bool:
        """Detect headers and footers using patterns"""
        patterns = [
            r'^\d+$',
            r'^Page \d+$',
            r'^\w+ \d{4}$',
            r'^[A-Z\s]+$'
        ]
        return any(re.match(pattern, line.strip()) for pattern in patterns)

    def _is_table_content(self, text: str, location_data: Dict) -> bool:
        """Detect if content is likely part of a table"""
        table_indicators = [
            len(text.split()) <= 3,  # Very short content
            bool(re.match(r'^\d+(\.\d+)?$', text.strip())),  # Just numbers
            bool(location_data.get('bbox')) and  # Check if content is in a grid-like structure
            len([x for x in text.split('\n') if x.strip()]) <= 2
        ]
        return any(table_indicators)

    def _should_merge_chunks(self, chunk: Dict) -> bool:
        """Determine if a chunk should be merged with surrounding context"""
        content = chunk['content'].strip()
        return (
            len(content) < self.min_chunk_length or
            bool(re.match(r'^\(\d+\)$', content)) or  # Matches patterns like "(7)"
            bool(re.match(r'^\d+/\d+$', content))     # Matches patterns like "71/77"
        )

    async def get_chunk_preview(self, chunk: DocumentChunk) -> Dict:
        """Generate preview data for a specific chunk"""
        if not chunk.location_data or 'bbox' not in chunk.location_data:
            return None

        doc = fitz.open(chunk.file_path)
        page = doc[chunk.page_number - 1]
        bbox = chunk.location_data['bbox']

        preview = page.get_pixmap(
            clip=fitz.Rect(bbox["x0"], bbox["y0"], bbox["x1"], bbox["y1"])
        )

        doc.close()
        return {
            "page": chunk.page_number,
            "coordinates": bbox,
            "preview_image": preview.tobytes("png")
        }