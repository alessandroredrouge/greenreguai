"""
Handles document processing, storage, and retrieval operations.
Manages interaction between Supabase storage and database for document metadata.
"""

from typing import List, Optional, Tuple
from ..services.supabase import supabase_service
from ..models.document_pydantic import DocumentSearchFilters, DocumentResponse, SearchResponse
import math

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
        try:
            # Use admin_client and correct column name
            result = self.supabase.admin_client.table('documents')\
                .select('*')\
                .eq('document_id', document_id)\
                .execute()
            
            if not result.data:
                return None
            
            document = result.data[0]
            return document
        except Exception as e:
            print(f"Document Service Error: {str(e)}")
            raise e

    async def search_documents(self, filters: DocumentSearchFilters) -> SearchResponse:
        """Search documents using filters and pagination"""
        try:
            # Start building the query
            query = self.supabase.admin_client.table('documents').select('*', count='exact')

            # Apply text search if query provided
            if filters.query:
                query = query.or_(
                    f"title.ilike.%{filters.query}%,"
                    f"description.ilike.%{filters.query}%"
                )

            # Apply filters
            if filters.region:
                query = query.eq('region', filters.region)
            
            if filters.category:
                query = query.eq('category', filters.category)
            
            if filters.tags and len(filters.tags) > 0:
                query = query.contains('tags', filters.tags)

            # Add year filter
            if filters.year:
                query = query.eq('publication_year', int(filters.year))

            # Calculate pagination
            start = (filters.page - 1) * filters.per_page
            end = start + filters.per_page - 1

            # Execute query with range
            result = query.range(start, end).execute()
            
            if not result.data:
                return SearchResponse(
                    items=[],
                    total=0,
                    page=filters.page,
                    per_page=filters.per_page,
                    total_pages=0
                )

            # Calculate total pages
            total_count = result.count
            total_pages = math.ceil(total_count / filters.per_page)

            # Get download URLs for documents
            documents = []
            for doc in result.data:
                try:
                    download_url = await self.get_document_url(doc['file_path'])
                    doc['download_url'] = download_url
                except Exception:
                    doc['download_url'] = None
                documents.append(DocumentResponse(**doc))

            return SearchResponse(
                items=documents,
                total=total_count,
                page=filters.page,
                per_page=filters.per_page,
                total_pages=total_pages
            )

        except Exception as e:
            print(f"Search Error: {str(e)}")
            raise e

# Create a singleton instance
document_service = DocumentService()