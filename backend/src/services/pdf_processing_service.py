"""
Service for processing PDF documents with semantic chunking and detailed location tracking
"""

from typing import List, Dict
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from ..models.document_pydantic import DocumentChunk
import fitz  # PyMuPDF
import re
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

class PDFProcessingService:
    def __init__(self, max_chunk_size: int = 1000):
        self.max_chunk_size = max_chunk_size
        
    async def process_pdf(self, file_path: str) -> Dict:
        """Process PDF file and extract text chunks"""
        try:
            logging.info(f"Starting PDF processing for file: {file_path}")
            doc = fitz.open(file_path)
            chunks = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text("text")
                cleaned_text = self._clean_page_text(text)
                
                if cleaned_text.strip():
                    page_chunks = self._create_semantic_chunks(cleaned_text, page_num + 1, page, doc.name)
                    chunks.extend(page_chunks)
                    
            doc.close()
            logging.info(f"Successfully processed PDF. Generated {len(chunks)} chunks.")
            return {"chunks": chunks}
            
        except Exception as e:
            logging.error(f"Error processing PDF: {str(e)}")
            raise

    def _clean_page_text(self, text: str) -> str:
        """Clean page text by removing redundant headers/footers and unnecessary whitespace"""
        # Remove common headers/footers
        text = re.sub(r'(?m)^EN\s*$', '', text)  # Remove standalone "EN"
        text = re.sub(r'\f', '', text)  # Remove form feeds
        
        # Remove redundant whitespace while preserving paragraph breaks
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r' {2,}', ' ', text)
        
        return text.strip()

    def _split_into_sections(self, text: str) -> List[str]:
        """Split text into semantic sections with improved granularity"""
        sections = []
        
        # First split on numbered points
        numbered_pattern = r'(?=\([0-9]+\)\s*)'
        numbered_sections = re.split(numbered_pattern, text)
        
        for section in numbered_sections:
            if not section.strip():
                continue
                
            # If this is a numbered point, it's likely a semantic unit
            if re.match(r'^\([0-9]+\)\s*', section):
                # Check if section is too long
                if len(section) > self.max_chunk_size:
                    # Try to split on natural breaks while preserving the number
                    number_match = re.match(r'(\([0-9]+\)\s*)(.*)', section, re.DOTALL)
                    if number_match:
                        number, content = number_match.groups()
                        subsections = content.split('\n\n')
                        # Add number back to first subsection
                        if subsections:
                            subsections[0] = number + subsections[0]
                            sections.extend([s.strip() for s in subsections if s.strip()])
                        continue
                
                sections.append(section.strip())
            else:
                # For non-numbered text, check if it's a standalone section
                if len(section.split()) > 10:  # If section has substantial content
                    sections.append(section.strip())
                elif sections:  # Combine short sections with previous content
                    sections[-1] = sections[-1] + "\n" + section.strip()
                else:  # First section
                    sections.append(section.strip())
        
        return sections

    def _create_semantic_chunks(self, text: str, page_num: int, page: fitz.Page, file_path: str) -> List[DocumentChunk]:
        """Create semantic chunks from text while preserving context"""
        chunks = []
        sections = self._split_into_sections(text)
        
        for i, section in enumerate(sections):
            # Extract section title
            section_title = ""
            if re.match(r'^\([0-9]+\)\s*', section):
                first_line = section.split('\n')[0]
                section_title = first_line[:100]
            elif section.isupper():
                section_title = section.split('\n')[0]
            
            # Get location data
            text_instances = page.search_for(section[:100].strip())
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
            
            # Determine chunk category based on content analysis
            category = self._determine_chunk_category(section, section_title)
            
            # Create context from previous and next chunks
            prev_context = sections[i-1][-200:] if i > 0 else None
            next_context = sections[i+1][:200] if i < len(sections)-1 else None
            
            # Calculate proper offsets
            start_offset = sum(len(s) for s in sections[:i])
            end_offset = start_offset + len(section)
            
            chunk = DocumentChunk(
                content=section.strip(),
                page_number=page_num,
                section_title=section_title,
                chunk_index=i,
                start_offset=start_offset,
                end_offset=end_offset,
                category=category,
                location_data=location_data,
                element_type=None,
                font_info=None,
                file_path=file_path,
                context={
                    "previous": prev_context,
                    "next": next_context
                }
            )
            chunks.append(chunk)
        
        return chunks

    def _determine_chunk_category(self, text: str, title: str) -> str:
        """Determine chunk category based on content analysis"""
        if title and title.isupper():
            return "Title"
        elif re.match(r'^\([0-9]+\)', text):
            return "Numbered Section"
        elif len(text.split('\n')) > 3:
            return "Text"
        elif re.match(r'^\d+\.\s', text):
            return "List Item"
        else:
            return "Other"

# Singleton instance
pdf_processing_service = PDFProcessingService()