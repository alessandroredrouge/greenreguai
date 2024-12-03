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
from typing import List, Dict, Any

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

    def generate_and_store_embeddings(self, chunks: List[Dict[str, Any]]) -> None:
        try:
            batch_size = 10  # Adjust based on API limits and performance
            for i in range(0, len(chunks), batch_size):
                batch = chunks[i:i + batch_size]
                texts = [chunk['content'] for chunk in batch]
                metadatas = [{'chunk_id': chunk['chunk_id']} for chunk in batch]
                
                # Add texts to vector store
                self.vector_store.add_texts(texts=texts, metadatas=metadatas)
                
                logging.info(f"Processed batch {i//batch_size + 1} of {(len(chunks)-1)//batch_size + 1}")
                
        except Exception as e:
            logging.error(f"Error in generate_and_store_embeddings: {str(e)}")
            raise