import asyncio
import logging
from src.services.embedding_service import EmbeddingService
from src.services.supabase import supabase_service

logging.basicConfig(level=logging.INFO)

async def test_embedding():
    # Get a small sample of chunks (e.g., 5) from Supabase
    result = supabase_service.admin_client.table('chunks')\
        .select('*')\
        .limit(5)\
        .execute()
    
    chunks = [
        {
            'chunk_id': chunk['chunk_id'],
            'content': chunk['content'],
            'document_id': chunk['document_id']
        }
        for chunk in result.data
    ]
    
    embedding_service = EmbeddingService()
    try:
        await embedding_service.generate_and_store_embeddings(chunks)
        logging.info("Successfully embedded test chunks!")
    except Exception as e:
        logging.error(f"Error during embedding: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_embedding()) 