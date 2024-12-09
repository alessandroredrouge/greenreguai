from typing import List, Dict
from src.services.pdf_processing_service import PDFProcessingService
from src.services.supabase import supabase_service
import tempfile
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

class PDFBatchProcessor:
    def __init__(self):
        self.pdf_processor = PDFProcessingService()
        self.supabase = supabase_service
        
    async def process_pdf_to_chunks(self, document: Dict) -> None:
        """Process a specific document into chunks"""
        try:
            logging.info(f"Starting to process document {document['document_id']}")
            await self._process_document(document)
            logging.info(f"Successfully processed document {document['document_id']} into chunks")
                
        except Exception as e:
            logging.error(f"Error processing document {document['document_id']} into chunks: {str(e)}")
            raise

    async def _process_document(self, document: Dict):
        """Process single document and save chunks"""
        temp_file = None
        try:
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            file_data = await self.supabase.download_file(document['file_path'])
            temp_file.write(file_data)
            temp_file.flush()
            temp_file.close()
            
            # Process PDF and get chunks
            processed = await self.pdf_processor.process_pdf(temp_file.name)
            
            # Save chunks
            await self._save_chunks(document['document_id'], processed['chunks'])
            
        finally:
            if temp_file:
                try:
                    os.unlink(temp_file.name)
                except Exception as e:
                    logging.warning(f"Failed to cleanup temporary file: {str(e)}")

    async def _save_chunks(self, document_id: str, chunks: List) -> List[str]:
        """Save chunks to database and return chunk IDs"""
        chunk_ids = []
        total_chunks = len(chunks)
        logging.info(f"Saving {total_chunks} chunks for document {document_id}")
        
        for i, chunk in enumerate(chunks, 1):
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
            result = self.supabase.admin_client.table('chunks')\
                .insert(chunk_data)\
                .execute()
            chunk_ids.append(result.data[0]['chunk_id'])
            
            if i % 10 == 0:  # Log progress every 10 chunks
                logging.info(f"Saved {i}/{total_chunks} chunks")
        
        logging.info(f"Successfully saved all {total_chunks} chunks for document {document_id}")
        return chunk_ids

# Singleton instance
pdf_batch_processor = PDFBatchProcessor()
