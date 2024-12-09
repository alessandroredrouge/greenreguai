import asyncio
import logging
from src.services.pdf_batch_processor import pdf_batch_processor
from src.services.embedding_service import embedding_service

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

async def process_document(document_id: str):
    try:
        # # Step 1: Process PDF into chunks
        # logging.info(f"Starting PDF processing for document {document_id}")
        # try:
        #     await pdf_batch_processor.process_pdf_to_chunks(document_id)
        #     logging.info(f"PDF processing completed for document {document_id}")
        # except Exception as e:
        #     logging.error(f"Error in PDF processing: {str(e)}")
        #     raise
        
        # Step 2: Generate embeddings for chunks
        logging.info(f"Starting embedding generation for document {document_id}")
        try:
            await embedding_service.generate_and_store_embeddings(document_id)
            logging.info(f"Embedding generation completed for document {document_id}")
        except Exception as e:
            logging.error(f"Error in embedding generation: {str(e)}")
            raise
        
    except Exception as e:
        logging.error(f"Error in document processing pipeline: {str(e)}")
        raise

if __name__ == "__main__":
    # Document ID for the new EU Commission document
    TEST_DOCUMENT_ID = "1c497e8b-2135-4b29-942e-a172bba4313a"
    
    try:
        asyncio.run(process_document(TEST_DOCUMENT_ID))
        logging.info("Document processing completed successfully")
    except Exception as e:
        logging.error(f"Process failed: {str(e)}")
        exit(1) 