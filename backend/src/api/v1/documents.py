"""
Endpoints for document management: listing, retrieving, and searching documents.
Handles both metadata and file operations through Supabase.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from ...services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["documents"])

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
        
        # Get temporary download URL
        download_url = await document_service.get_document_url(document['file_path'])
        return {**document, "download_url": download_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))