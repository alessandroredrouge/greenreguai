"""
Supabase client configuration and core operations for both database
and storage interactions. Handles connection management and basic CRUD operations.
"""

from supabase import create_client, Client
from ..core.config import settings

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

    async def get_file_url(self, path: str, expires_in: int = 3600) -> str:
        """Generate a signed URL for file download"""
        try:
            # Use the official_documents bucket
            bucket_name = 'official_documents'
            
            client = await self.get_storage_client(admin=True)
            response = client.storage.from_(bucket_name).create_signed_url(
                path,  # This should be like 'europe/red_iii_2023.pdf'
                expires_in
            )
            return response['signedURL']
        except Exception as e:
            print(f"Error generating URL: {str(e)}, Path: {path}, Bucket: {bucket_name}")
            raise e

    async def list_files(self, folder: str = "") -> list:
        """List files in a specific folder"""
        client = await self.get_storage_client()
        return client.storage.from_(self.bucket_name).list(folder)

# Create a singleton instance
supabase_service = SupabaseService()
