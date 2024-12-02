"""
Pydantic models for document-related data structures including
metadata, search results, and document chunks.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class DocumentBase(BaseModel):
    """Base document metadata model"""
    title: str
    description: Optional[str] = None
    region: str
    category: str
    tags: List[str] = []
    file_path: str
    file_size: int
    mime_type: str
    url_source: Optional[str] = None
    publication_year: int

class DocumentResponse(DocumentBase):
    """Model for document responses"""
    document_id: str
    created_at: datetime
    updated_at: datetime
    download_url: Optional[str] = None

class DocumentSearchFilters(BaseModel):
    """Search parameters model"""
    query: Optional[str] = Field(None, description="Search query for title and description")
    region: Optional[str] = Field(None, description="Filter by region")
    category: Optional[str] = Field(None, description="Filter by category")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    year: Optional[int] = Field(None, description="Filter by publication year")
    page: int = Field(1, ge=1, description="Page number")
    per_page: int = Field(10, ge=1, le=100, description="Items per page")

class SearchResponse(BaseModel):
    """Search results model"""
    items: List[DocumentResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

class DocumentChunk(BaseModel):
    content: str
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    chunk_index: Optional[int] = None
    start_offset: Optional[int] = None
    end_offset: Optional[int] = None
    category: Optional[str] = None
    location_data: Optional[Dict] = Field(default_factory=dict)
    element_type: Optional[str] = None
    font_info: Optional[Dict] = Field(default_factory=dict)
    file_path: Optional[str] = None
    context: Optional[Dict[str, Optional[str]]] = Field(
        default_factory=dict,
        description="Contains previous and next chunk context",
        example={
            "previous": "Text from previous chunk",
            "next": "Text from next chunk"
        }
    )