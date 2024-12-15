"""
Endpoints for document management: listing, retrieving, and searching documents.
Handles both metadata and file operations through Supabase.
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Body
from typing import List, Optional
from ...services.document_service import document_service
from ...models.document_pydantic import DocumentSearchFilters, SearchResponse

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("/search", response_model=SearchResponse)
async def search_documents(
    query: Optional[str] = Query(None, description="Search query for title and description"),
    region: Optional[str] = Query(None, description="Filter by region"),
    category: Optional[str] = Query(None, description="Filter by category"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    year: Optional[int] = Query(None, description="Filter by publication year"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page")
) -> SearchResponse:
    """
    Search documents with filters and pagination.
    Returns paginated results with download URLs.
    """
    try:
        filters = DocumentSearchFilters(
            query=query,
            region=region,
            category=category,
            tags=tags,
            year=year,
            page=page,
            per_page=per_page
        )
        return await document_service.search_documents(filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_documents(folder: Optional[str] = None) -> List[dict]:
    """List all available documents"""
    try:
        documents = await document_service.list_documents(folder)
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}")
async def get_document(document_id: str):
    """Get document details and download URL"""
    try:
        document = await document_service.get_document_by_id(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        try:
            # Get temporary download URL
            download_url = await document_service.get_document_url(document['file_path'])
            return {**document, "download_url": download_url}
        except Exception as e:
            print(f"Error getting download URL: {str(e)}")
            # Return document without download URL if URL generation fails
            return document
            
    except Exception as e:
        print(f"Error in get_document endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{document_id}/process")
async def process_document(document_id: str):
    """Process a document with the specified ID"""
    try:
        processed_doc = await document_service.process_document(document_id)
        return processed_doc
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/from-storage")
async def create_document_from_storage(storage_path: str = Body(..., embed=True)):
    """Create document record from file in storage"""
    try:
        document = await document_service.create_document_from_upload(storage_path)
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))