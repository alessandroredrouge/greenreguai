"""
Chat endpoints handling user queries and responses.
Integrates RAG and LLM services with credit management.
"""

from fastapi import APIRouter, HTTPException
import logging
from ...models.chat_pydantic import ChatRequest, ChatResponse, ErrorResponse, ConversationHistory, ChatMessage
from ...services.rag_service import rag_service
from ...services.llm_service import llm_service
from ...services.supabase import supabase_service
from uuid import uuid4
from ...services.conversation_service import conversation_service

router = APIRouter(tags=["chat"])
logger = logging.getLogger(__name__)

@router.post("/chat")
async def process_chat_query(request: ChatRequest):
    try:
        # Get user_id from email using Supabase
        result = supabase_service.admin_client.from_('user_profiles')\
            .select('user_id, credits')\
            .eq('email', request.email)\
            .single()\
            .execute()
            
        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )
            
        user_id = result.data['user_id']
        credits = result.data['credits']
        
        # Check credits
        if credits <= 0:
            raise HTTPException(
                status_code=402,  # Payment Required
                detail="Insufficient credits. Please purchase more credits to continue using the AI Assistant."
            )

        # First get/create conversation
        conversation = conversation_service.get_or_create_conversation(
            request.conversation_id,
            user_id
        )
        
        # Save user's message
        user_message = {
            "conversation_id": conversation.conversation_id,
            "user_id": conversation.user_id,
            "role": "user",
            "content": request.query,
            "credits_used": 0  # User messages don't use credits
        }
        supabase_service.admin_client.table('messages').insert(user_message).execute()
        
        # Process with RAG + LLM
        rag_result = await rag_service.process_query(request.query)
        llm_result = await llm_service.generate_rag_response(
            query=request.query,
            context=rag_result["context"],
            conversation_id=conversation.conversation_id
        )
        
        # Extract used chunks from response
        used_chunks = extract_used_chunks(
            llm_result["response"], 
            rag_result["context"]["chunks"]
        )
        
        # Save assistant's message with credits_used = -1
        assistant_message = {
            "conversation_id": conversation.conversation_id,
            "user_id": conversation.user_id,
            "role": "assistant",
            "content": llm_result["response"],
            "credits_used": -1,  # Explicitly set credit usage for assistant messages
            "sources": {
                str(chunk["index"]): {
                    "chunk_id": chunk["source"]["chunk_id"],
                    "document_id": chunk["source"]["document_id"],
                    "page_number": chunk["source"]["page_number"],
                    "section_title": chunk["source"]["section_title"],
                    "location_data": chunk["source"]["location_data"],
                    "content": chunk["content"]
                }
                for chunk in used_chunks
            }
        }
        result = supabase_service.admin_client.table('messages').insert(assistant_message).execute()
        
        return ChatResponse(
            response=llm_result["response"],
            sources=used_chunks,
            conversation_id=conversation.conversation_id,
            tokens_used=len(request.query.split()) + len(llm_result["response"].split())
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing chat query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_used_chunks(response: str, available_chunks: list) -> list:
    """Extract only the chunks that were actually cited in the response"""
    used_indices = set()
    
    # Find all citations in the response using regex
    # Format: [0] or [1,2,3] or [0,5]
    import re
    citations = re.findall(r'\[([0-9,\s]+)\]', response)
    
    # Extract indices from citations
    for citation in citations:
        indices = [int(idx.strip()) for idx in citation.split(',')]
        used_indices.update(indices)
    
    # Return only the chunks that were actually cited
    return [
        chunk for chunk in available_chunks 
        if chunk["index"] in used_indices
    ]

async def get_next_message_index(conversation_id: str) -> int:
    """Get the next message index for a conversation"""
    if not conversation_id:
        return 0
        
    result = await supabase_service.admin_client.table('messages')\
        .select('message_index')\
        .eq('conversation_id', conversation_id)\
        .order('message_index', desc=True)\
        .limit(1)\
        .execute()
        
    return (result.data[0]['message_index'] + 1) if result.data else 0

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get all messages in a conversation"""
    try:
        result = await supabase_service.admin_client.table('messages')\
            .select('*')\
            .eq('conversation_id', conversation_id)\
            .order('message_index', ascending=True)\
            .execute()
            
        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
            
        return ConversationHistory(
            conversation_id=conversation_id,
            messages=[ChatMessage(**msg) for msg in result.data]
        )
            
    except Exception as e:
        logger.error(f"Error retrieving conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))