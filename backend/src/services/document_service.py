"""
Handles document processing, storage, and retrieval operations.
Manages interaction between Supabase storage and database for document metadata.
"""

from typing import List, Optional
from ..services.supabase import supabase_service

class DocumentService:
    def __init__(self):
        self.supabase = supabase_service

    async def list_documents(self, folder: Optional[str] = None) -> List[dict]:
        """List all documents with their metadata"""
        try:
            # Use admin_client instead of regular client
            query = self.supabase.admin_client.table('documents').select('*')
            if folder:
                query = query.eq('category', folder)
            
            result = query.execute()
            return result.data
        except Exception as e:
            print(f"Document Service Error: {str(e)}")
            raise e

    async def get_document_url(self, file_path: str) -> str:
        """Get a temporary URL for document download"""
        return await self.supabase.get_file_url(file_path)

    async def get_document_by_id(self, document_id: str) -> Optional[dict]:
        """Get document metadata by ID"""
        result = self.supabase.client.table('documents')\
            .select('*')\
            .eq('document_id', document_id)\
            .execute()
        
        return result.data[0] if result.data else None

# Create a singleton instance
document_service = DocumentService()