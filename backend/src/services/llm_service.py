"""
LLM integration service handling prompt construction, LLM interactions,
and response processing. Uses Langchain for enhanced LLM capabilities.
"""

from typing import Dict, Any, Optional
import logging
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from ..core.config import settings

logging.basicConfig(level=logging.INFO)

class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",  # Using latest GPT-4 for better instruction following
            temperature=0.1,  # Lower temperature for more focused responses
            api_key=settings.OPENAI_API_KEY
        )
        
        # Define RAG prompt template
        self.rag_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an AI assistant specialized in renewable energy regulations. 
Your task is to provide accurate, well-sourced answers based on the provided context.

Guidelines:
- Use ONLY the information from the provided context
- If you can't answer from the context, say so
- ALWAYS cite sources using [{{index}}] format, where index is the chunk number
- Every relevant statement must have a citation
- If a statement combines information from multiple chunks, cite all relevant chunks like [0,2,3]
- Keep responses clear and concise
- Maintain professional tone

Example citation format:
"The renewable energy target for 2030 is 42.5% [0]. This includes specific provisions for hydrogen production [0,3] and storage requirements [2]."

Context format:
Each context chunk is numbered and contains:
- index: The chunk number to use in citations
- content: The actual text
- source: Metadata including page numbers"""),
            ("user", "Question: {{question}}\n\nContext:\n{{context}}"),
        ])
        
        self.output_parser = StrOutputParser()
        
    async def generate_rag_response(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a response using RAG context
        Returns response text with citations and metadata
        """
        try:
            # Format context for prompt
            formatted_context = self._format_context(context)
            
            # Generate response
            chain = self.rag_prompt | self.llm | self.output_parser
            response = await chain.ainvoke({
                "question": query,
                "context": formatted_context
            })
            
            return {
                "response": response,
                "sources": context["chunks"]  # Return source chunks for citation tracking
            }
            
        except Exception as e:
            logging.error(f"Error generating RAG response: {str(e)}")
            raise e
            
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context chunks for the prompt"""
        formatted_chunks = []
        
        for chunk in context["chunks"]:
            formatted_chunks.append(
                f"[Chunk {chunk['index']}]\n"
                f"{chunk['content']}\n"
            )
            
        return "\n\n".join(formatted_chunks)

# Singleton instance
llm_service = LLMService()
