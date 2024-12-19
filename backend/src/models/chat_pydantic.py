"""
Pydantic models for chat-related data structures including
queries, responses, and source citations.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class ChatSource(BaseModel):
    """Source metadata for citations"""
    chunk_id: str
    document_id: str
    page_number: int
    section_title: Optional[str]
    location_data: Optional[Dict]
    content: str

class ChatMessage(BaseModel):
    """Single message in a conversation"""
    message_id: str
    conversation_id: str
    user_id: str
    role: str  # 'user' or 'assistant'
    content: str
    sources: Optional[Dict[str, ChatSource]]  # index -> source mapping
    message_index: int
    created_at: datetime

class ChatRequest(BaseModel):
    """Incoming chat request"""
    query: str = Field(..., description="User's question")
    conversation_id: Optional[str] = Field(None, description="ID of existing conversation")
    email: str = Field(..., description="User's email from Supabase auth")

class ChatResponse(BaseModel):
    """Response including answer and source information"""
    response: str
    sources: List[Dict]
    conversation_id: str
    tokens_used: int

class ConversationHistory(BaseModel):
    """Complete conversation history"""
    conversation_id: str
    messages: List[ChatMessage]

class ErrorResponse(BaseModel):
    """Error response structure"""
    error: str
    detail: Optional[str] = None

class ConversationBase(BaseModel):
    """Base model for creating a conversation"""
    user_id: str
    title: str = Field(default="New Conversation")
    total_credits_used: int = Field(default=0)

class ConversationResponse(ConversationBase):
    """Model for conversation data returned from Supabase"""
    conversation_id: str
    created_at: datetime
    updated_at: datetime