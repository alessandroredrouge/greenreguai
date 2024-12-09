import asyncio
import logging
from src.services.document_service import document_service
from src.models.document_pydantic import ProcessingStatus

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

async def test_document_processing():
    # Use the document ID from your Supabase documents table
    document_id = "d61858f1-720e-43fa-bf92-aada8b21789e"
    
    try:
        # Get initial document state
        initial_doc = await document_service.get_document_by_id(document_id)
        logging.info(f"Initial document status: {initial_doc.get('processing_status')}")
        
        # Process document
        processed_doc = await document_service.process_document(document_id)
        
        # Verify final state
        final_doc = await document_service.get_document_by_id(document_id)
        logging.info(f"Final document status: {final_doc.get('processing_status')}")
        
        if final_doc.get('processing_status') == ProcessingStatus.COMPLETED:
            logging.info("Document processing completed successfully!")
        else:
            logging.error(f"Processing failed: {final_doc.get('error_message')}")
            
    except Exception as e:
        logging.error(f"Test failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(test_document_processing())