from typing import List, Dict
from src.services.pdf_processing_service import PDFProcessingService
from src.services.document_service import document_service
from src.services.supabase import supabase_service
import tempfile
import os

class PDFBatchProcessor:
    def __init__(self):
        self.pdf_processor = PDFProcessingService()
        self.supabase = supabase_service
        
    async def process_all_unprocessed(self):
        """Process all unprocessed PDFs in storage"""
        documents = await document_service.list_documents()
        for document in documents:
            if not await self._has_chunks(document['document_id']):
                await self._process_document(document)

    async def _has_chunks(self, document_id: str) -> bool:
        """Check if document has chunks"""
        result = self.supabase.admin_client.table('chunks')\
            .select('chunk_id')\
            .eq('document_id', document_id)\
            .execute()
        return len(result.data) > 0

    async def _process_document(self, document: Dict):
        """Process single document and save chunks"""
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            file_data = await self.supabase.download_file(document['file_path'])
            temp_file.write(file_data)
            temp_file.flush()
            
            try:
                processed = await self.pdf_processor.process_pdf(temp_file.name)
                await self._save_chunks(document['document_id'], processed['chunks'])
            finally:
                os.unlink(temp_file.name)

    async def _save_chunks(self, document_id: str, chunks: List):
        """Save chunks to database"""
        print(f'Processing document with Id: {document_id}')
        print('Starting to save chunks...')
        num_chunk=0
        for chunk in chunks:
            chunk_data = {
                'document_id': document_id,
                'content': chunk.content,
                'page_number': chunk.page_number,
                'section_title': chunk.section_title,
                'chunk_index': chunk.chunk_index,
                'start_offset': chunk.start_offset,
                'end_offset': chunk.end_offset,
                'category': chunk.category,
                'location_data': chunk.location_data,
                'element_type': chunk.element_type,
                'font_info': chunk.font_info,
                'context': chunk.context
            }
            print(f'Chunk num. {num_chunk}/{len(chunks)} saved')
            num_chunk+=1
            self.supabase.admin_client.table('chunks').insert(chunk_data).execute()

# Singleton instance
pdf_batch_processor = PDFBatchProcessor()
