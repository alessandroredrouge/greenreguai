"""
Manages document embedding generation and vector storage operations.
Interfaces with Pinecone for vector similarity search.
"""

from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone as PineconeClient
from dotenv import load_dotenv
import os
import logging
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

class EmbeddingService:
    def __init__(self):
        # Initialize OpenAI embeddings
        self.embeddings = OpenAIEmbeddings(
            api_key=os.getenv('OPENAI_API_KEY'),
            model="text-embedding-ada-002"
        )
        
        # Initialize Pinecone
        pc = PineconeClient(api_key=os.getenv('PINECONE_API_KEY'))
        index = pc.Index(os.getenv('PINECONE_INDEX_NAME'))
        
        # Initialize vector store
        self.vector_store = PineconeVectorStore(
            embedding=self.embeddings,
            index=index
        )
        
        # Configure batch settings
        self.batch_size = 10

    async def generate_and_store_embeddings(self, document_id: str) -> None:
        """Generate and store embeddings for a specific document in batches"""
        from src.services.supabase import supabase_service
        
        try:
            # Get all chunks for the document
            result = supabase_service.admin_client.table('chunks')\
                .select('*')\
                .eq('document_id', document_id)\
                .execute()
            
            if not result.data:
                logging.warning(f"No chunks found for document {document_id}")
                return
                
            chunks = result.data
            total_chunks = len(chunks)
            logging.info(f"Processing {total_chunks} chunks for document {document_id}")
            
            # Process in batches
            total_batches = (total_chunks - 1) // self.batch_size + 1
            
            for i in range(0, total_chunks, self.batch_size):
                batch = chunks[i:i + self.batch_size]
                texts = [chunk['content'] for chunk in batch]
                metadatas = [{
                    'chunk_id': chunk['chunk_id'],
                    'document_id': document_id,
                    'text': chunk['content']
                } for chunk in batch]
                
                # Add texts to vector store
                await self.vector_store.aadd_texts(texts=texts, metadatas=metadatas)
                
                logging.info(f"Processed embedding batch {i//self.batch_size + 1} of {total_batches}")
            
            logging.info(f"Successfully processed all chunks for document {document_id}")
                
        except Exception as e:
            logging.error(f"Error generating embeddings for document {document_id}: {str(e)}")
            raise

# Singleton instance
embedding_service = EmbeddingService()