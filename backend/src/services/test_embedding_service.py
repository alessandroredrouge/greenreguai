from embedding_service import EmbeddingService
import asyncio

async def test_embedding_service():
    # Create some test chunks
    test_chunks = [
        {
            'chunk_id': '1',
            'content': 'This is a test chunk about renewable energy regulations.'
        },
        {
            'chunk_id': '2',
            'content': 'Solar power installations must comply with local building codes.'
        }
    ]

    # Initialize the service
    embedding_service = EmbeddingService()
    
    try:
        # Test embedding generation and storage
        embedding_service.generate_and_store_embeddings(test_chunks)
        print("Successfully generated and stored embeddings!")
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_embedding_service())