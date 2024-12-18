import pytest
import asyncio
from src.services.rag_service import rag_service
from src.services.llm_service import llm_service

@pytest.mark.asyncio
async def test_rag_response_generation():
    """Test the complete RAG + LLM pipeline with citation format"""
    
    # Test queries focused on specific regulations
    queries = [
        "What are the main targets and requirements in RED III?",
        "What are the specific regulations for offshore wind power development?",
        "How does Japan regulate renewable energy projects?"
    ]
    
    for query in queries:
        print("\n" + "="*80)
        print(f"Testing query: '{query}'")
        print("="*80)
        
        try:
            # Get RAG context
            rag_result = await rag_service.process_query(query)
            
            # Generate response
            llm_result = await llm_service.generate_rag_response(
                query=query,
                context=rag_result["context"]
            )
            
            # Print detailed results
            print("\nGenerated Response:")
            print("-" * 40)
            print(llm_result["response"])
            print("\nSource Chunks Used:")
            print("-" * 40)
            for chunk in llm_result["sources"]:
                print(f"\nChunk [{chunk['index']}]:")
                print(f"Page: {chunk['source']['page_number']}")
                print(f"Score: {chunk['source']['similarity_score']:.4f}")
                print(f"Section: {chunk['source']['section_title'] or 'N/A'}")
                print("-" * 20)
                print(f"Preview: {chunk['content'][:200]}...")
            
        except Exception as e:
            pytest.fail(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_rag_response_generation()) 