import pytest
import asyncio
from uuid import uuid4
from src.services.rag_service import rag_service
from src.services.llm_service import llm_service
from src.services.supabase import supabase_service
from src.api.v1.chat import extract_used_chunks
from src.services.conversation_service import conversation_service

@pytest.mark.asyncio
async def test_conversation_flow():
    """Test a complete conversation with multiple exchanges"""
    
    # Create initial conversation
    conversation = conversation_service.create_conversation(
        user_id="9f4cbd8c-66d0-4387-9443-14c9f20b91f6",
        title="Test Conversation"
    )
    
    # Simulate a conversation
    queries = [
        "What are the main targets in RED III?",
        "How does this relate to offshore wind development?",
        "What are the specific requirements for member states?"
    ]
    

    conversation_id = conversation.conversation_id
    test_user_id = "9f4cbd8c-66d0-4387-9443-14c9f20b91f6"
    
    for i, query in enumerate(queries):
        print(f"\n{'='*80}\nQuery {i+1}: {query}\n{'='*80}")
        
        try:
            # Save user message
            user_message = {
                "conversation_id": conversation_id,
                "user_id": test_user_id,
                "role": "user",
                "content": query
            }
            supabase_service.admin_client.table('messages').insert(user_message).execute()
            
            # Get RAG context
            rag_result = await rag_service.process_query(query)
            
            # Generate response with history
            llm_result = await llm_service.generate_rag_response(
                query=query,
                context=rag_result["context"],
                conversation_id=conversation_id
            )
            
            # Extract used chunks
            used_chunks = extract_used_chunks(
                llm_result["response"],
                rag_result["context"]["chunks"]
            )
            
            # Save assistant message
            assistant_message = {
                "conversation_id": conversation_id,
                "user_id": test_user_id,
                "role": "assistant",
                "content": llm_result["response"],
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
            supabase_service.admin_client.table('messages').insert(assistant_message).execute()
            
            # Print results
            print("\nResponse:")
            print("-" * 40)
            print(llm_result["response"])
            print("\nUsed Sources:")
            print("-" * 40)
            for chunk in used_chunks:
                print(f"\nChunk [{chunk['index']}]:")
                print(f"Document ID: {chunk['source']['document_id']}")
                print(f"Page: {chunk['source']['page_number']}")
                print(f"Content Preview: {chunk['content'][:200]}...")
                print("-" * 40)
            
        except Exception as e:
            pytest.fail(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_conversation_flow()) 