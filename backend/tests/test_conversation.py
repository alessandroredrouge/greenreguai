import pytest
import asyncio
from src.api.v1.chat import process_chat_query
from src.models.chat_pydantic import ChatRequest, ChatResponse

@pytest.mark.asyncio
async def test_conversation_flow():
    """Test a complete conversation with multiple exchanges"""
    
    test_user_id = "9f4cbd8c-66d0-4387-9443-14c9f20b91f6"
    test_user_email = 'exampleuser@example.com'
    queries = [
        "What's the RepowerEU act?",
        "What's RED III?",
        "What did I ask you before?"
    ]
    
    conversation_id = None
    
    for i, query in enumerate(queries):
        print(f"\n{'='*80}\nQuery {i+1}: {query}\n{'='*80}")
        
        try:
            # Create chat request
            request = ChatRequest(
                query=query,
                conversation_id=conversation_id,
                email=test_user_email
            )
            
            # Process query using the actual API endpoint
            response = await process_chat_query(request)
            
            # Store conversation_id for next iterations
            conversation_id = response.conversation_id
            
            # Print results
            print("\nResponse:")
            print("-" * 40)
            print(response.response)
            print("\nUsed Sources:")
            print("-" * 40)
            for chunk in response.sources:
                print(f"\nChunk [{chunk['index']}]:")
                print(f"Document ID: {chunk['source']['document_id']}")
                print(f"Page: {chunk['source']['page_number']}")
                print(f"Content Preview: {chunk['content'][:200]}...")
            
        except Exception as e:
            pytest.fail(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_conversation_flow()) 