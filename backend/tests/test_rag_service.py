import pytest
import asyncio
from src.services.rag_service import rag_service

@pytest.mark.asyncio
async def test_rag_query_processing():
    """Test the complete RAG pipeline with a sample query"""
    
    # Test query about offshore wind regulations
    query = "What are the European Transport Corridors?"
    print("\n" + "="*80)
    print(f"Testing RAG with query: '{query}'")
    print("="*80)
    
    try:
        # Process query through RAG pipeline
        result = await rag_service.process_query(query)
        
        # Basic structure checks
        assert "query" in result
        assert "context" in result
        assert "total_chunks" in result
        
        # Context structure checks
        context = result["context"]
        assert "chunks" in context
        assert len(context["chunks"]) > 0
        
        # Print detailed results
        print(f"\nRetrieved {len(context['chunks'])} relevant chunks:\n")
        
        for i, chunk in enumerate(context['chunks']):
            print(f"\nCHUNK {i+1}/{len(context['chunks'])}:")
            print("-" * 40)
            print(f"Similarity Score: {chunk['source']['similarity_score']:.4f}")
            print(f"Page Number: {chunk['source']['page_number']}")
            print(f"Section Title: {chunk['source']['section_title'] or 'N/A'}")
            print("\nContent Preview:")
            print(f"{chunk['content'][:500]}...")
            print("-" * 80)
        
        return result
        
    except Exception as e:
        pytest.fail(f"Test failed with error: {str(e)}")

if __name__ == "__main__":
    # Run test directly if needed
    asyncio.run(test_rag_query_processing()) 