"""
RAG (Retrieval Augmented Generation) service that handles:
- Query processing and embedding
- Relevant chunk retrieval
- Context assembly with source tracking
- Response generation with citations
"""

from typing import List, Dict, Any
import logging
from langchain_core.documents import Document
from .embedding_service import embedding_service
from .supabase import supabase_service

logging.basicConfig(level=logging.INFO)

class RAGService:
    def __init__(self):
        self.embedding_service = embedding_service
        self.vector_store = embedding_service.vector_store
        self.supabase = supabase_service
        
        # Configuration parameters
        self.max_chunks = 10  # Maximum chunks to retrieve
        self.similarity_threshold = 0.7  # Minimum similarity score
        
    async def process_query(self, query: str) -> Dict[str, Any]:
        """
        Process a user query through the RAG pipeline
        Returns relevant chunks with their metadata and similarity scores
        """
        try:
            # Get relevant chunks from vector store
            relevant_docs = await self._retrieve_relevant_chunks(query)
            
            # Assemble context with metadata
            context = self._assemble_context(relevant_docs)
            
            return {
                "query": query,
                "context": context,
                "total_chunks": len(relevant_docs)
            }
            
        except Exception as e:
            logging.error(f"Error processing RAG query: {str(e)}")
            raise

    async def _retrieve_relevant_chunks(self, query: str) -> List[Dict]:
        """
        Retrieve relevant chunks from vector store based on query similarity
        """
        try:
            # Use vector store's similarity search
            docs_with_scores = await self.vector_store.asimilarity_search_with_score(
                query,
                k=self.max_chunks
            )
            
            # Filter and format results
            relevant_chunks = []
            for doc, score in docs_with_scores:
                if score >= self.similarity_threshold:
                    # Get full chunk data from Supabase
                    chunk_data = self._get_chunk_data(doc.metadata['chunk_id'])
                    if chunk_data:
                        relevant_chunks.append({
                            "chunk": chunk_data,
                            "similarity_score": score
                        })
            
            return relevant_chunks
            
        except Exception as e:
            logging.error(f"Error retrieving relevant chunks: {str(e)}")
            raise

    def _get_chunk_data(self, chunk_id: str) -> Dict:
        """
        Retrieve full chunk data from Supabase
        """
        try:
            result = self.supabase.admin_client.table('chunks')\
                .select('*')\
                .eq('chunk_id', chunk_id)\
                .execute()
            
            return result.data[0] if result.data else None
            
        except Exception as e:
            logging.error(f"Error retrieving chunk data: {str(e)}")
            raise

    def _assemble_context(self, relevant_chunks: List[Dict]) -> Dict:
        """
        Assemble retrieved chunks into an array-based context format
        Each chunk maintains its content and detailed source information
        """
        try:
            # Sort chunks by similarity score
            sorted_chunks = sorted(
                relevant_chunks,
                key=lambda x: x['similarity_score'],
                reverse=True
            )
            
            # Create array-based context with detailed source tracking
            context = {
                "chunks": [{
                    "index": i,  # Add index for easy reference
                    "content": chunk['chunk']['content'],
                    "source": {
                        "chunk_id": chunk['chunk']['chunk_id'],
                        "document_id": chunk['chunk']['document_id'],
                        "page_number": chunk['chunk']['page_number'],
                        "section_title": chunk['chunk']['section_title'],
                        "location_data": chunk['chunk']['location_data'],
                        "similarity_score": chunk['similarity_score']
                    }
                } for i, chunk in enumerate(sorted_chunks)]
            }
            
            return context
            
        except Exception as e:
            logging.error(f"Error assembling context: {str(e)}")
            raise

# Singleton instance
rag_service = RAGService()
