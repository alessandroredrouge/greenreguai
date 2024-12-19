"""
Manages conversation operations including creation, retrieval,
and metadata management.
"""

from typing import Dict, Optional
from datetime import datetime
import logging
from .supabase import supabase_service
from ..models.chat_pydantic import ConversationBase, ConversationResponse

logging.basicConfig(level=logging.INFO)

class ConversationService:
    def __init__(self):
        self.supabase = supabase_service

    def create_conversation(self, user_id: str, title: str = "New Conversation") -> ConversationResponse:
        """Create a new conversation"""
        try:
            conversation_data = ConversationBase(
                user_id=user_id,
                title=title
            )
            
            result = self.supabase.admin_client.table('conversations')\
                .insert(conversation_data.model_dump())\
                .execute()
                
            return ConversationResponse(**result.data[0])
            
        except Exception as e:
            logging.error(f"Error creating conversation: {str(e)}")
            raise

    def get_conversation(self, conversation_id: str) -> Optional[ConversationResponse]:
        """Get conversation by ID"""
        try:
            result = self.supabase.admin_client.table('conversations')\
                .select('*')\
                .eq('conversation_id', conversation_id)\
                .execute()
                
            return ConversationResponse(**result.data[0]) if result.data else None
            
        except Exception as e:
            logging.error(f"Error retrieving conversation: {str(e)}")
            raise

    def get_or_create_conversation(
        self, 
        conversation_id: Optional[str], 
        user_id: str
    ) -> ConversationResponse:
        """Get existing conversation or create new one"""
        try:
            if conversation_id:
                conversation = self.get_conversation(conversation_id)
                if conversation:
                    return conversation
                    
            return self.create_conversation(user_id)
            
        except Exception as e:
            logging.error(f"Error in get_or_create_conversation: {str(e)}")
            raise

# Singleton instance
conversation_service = ConversationService() 