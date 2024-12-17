"""
Supabase client configuration and core operations for both database
and storage interactions. Handles connection management and basic CRUD operations.
"""

from supabase import create_client, Client
from ..core.config import settings
import logging
from typing import List, Dict, Set
from ..models.document_pydantic import ProcessingStatus

class SupabaseService:
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        # For admin operations (like managing storage)
        self.admin_client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
        self.bucket_name = settings.STORAGE_BUCKET

    async def get_storage_client(self, admin: bool = False) -> Client:
        """Get appropriate storage client based on operation type"""
        return self.admin_client if admin else self.client

    async def download_file(self, path: str) -> bytes:
        """Download file from storage bucket"""
        try:
            response = self.admin_client.storage.from_(self.bucket_name)\
                .download(path)
            return response
        except Exception as e:
            print(f"Error downloading file: {str(e)}, Path: {path}")
            raise e

    async def get_file_url(self, path: str, expires_in: int = 3600) -> str:
        """Generate a signed URL for file download"""
        try:
            response = self.admin_client.storage.from_(self.bucket_name).create_signed_url(
                path,
                expires_in
            )
            return response['signedURL']
        except Exception as e:
            print(f"Error generating URL: {str(e)}, Path: {path}")
            raise e

    async def list_files(self, folder: str = "") -> list:
        """List files in a specific folder"""
        client = await self.get_storage_client()
        return client.storage.from_(self.bucket_name).list(folder)

    async def get_storage_files(self) -> Set[str]:
        """Get all file paths from storage bucket"""
        try:
            # Use storage API instead of querying the table directly
            files = self.admin_client.storage.from_(self.bucket_name).list()
            return {file['name'] for file in files}
        except Exception as e:
            logging.error(f"Error getting storage files: {str(e)}")
            raise

    async def get_processed_documents(self) -> Set[str]:
        """Get all file paths from documents table"""
        try:
            result = self.admin_client.table('documents')\
                .select('file_path')\
                .execute()
            return {doc['file_path'] for doc in result.data}
        except Exception as e:
            logging.error(f"Error getting processed documents: {str(e)}")
            raise

    async def sync_unprocessed_documents(self) -> None:
        """
        Check for unprocessed documents and trigger processing.
        This method will be called by the background task scheduler.
        """
        from ..services.document_service import document_service  # Import here to avoid circular imports
        
        try:
            logging.info("Starting document sync process")
            
            # Get files from both storage and documents tables
            storage_files = await self.get_storage_files()
            processed_files = await self.get_processed_documents()
            
            # Find unprocessed files
            unprocessed_files = storage_files - processed_files
            
            if not unprocessed_files:
                logging.info("No new documents to process")
                return
                
            logging.info(f"Found {len(unprocessed_files)} unprocessed documents")
            
            # Process each unprocessed file
            for file_path in unprocessed_files:
                try:
                    logging.info(f"Processing document: {file_path}")
                    
                    # Create document record and extract metadata
                    doc = await document_service.create_document_from_upload(file_path)
                    
                    if doc and doc.get('document_id'):
                        # Process document (create chunks and embeddings)
                        await document_service.process_document(doc['document_id'])
                        logging.info(f"Successfully processed document: {file_path}")
                    else:
                        logging.error(f"Failed to create document record for: {file_path}")
                        
                except Exception as e:
                    logging.error(f"Error processing document {file_path}: {str(e)}")
                    # Continue with next document
                    continue
            
            logging.info("Document sync process completed")
            
        except Exception as e:
            logging.error(f"Error in document sync process: {str(e)}")
            raise

# Create a singleton instance
supabase_service = SupabaseService()
