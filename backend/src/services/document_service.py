"""
Handles document processing, storage, and retrieval operations.
Manages interaction between Supabase storage and database for document metadata.
"""

from typing import List, Optional, Tuple, Dict
from datetime import datetime
import logging
import tempfile
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_community.document_loaders import UnstructuredPDFLoader
from ..services.supabase import supabase_service
from ..models.document_pydantic import DocumentSearchFilters, DocumentResponse, SearchResponse, ProcessingStatus, DocumentBase
from .pdf_batch_processor import pdf_batch_processor
from .embedding_service import embedding_service
import math

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)

class DocumentService:
    def __init__(self):
        self.supabase = supabase_service
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0,
            openai_api_key=os.getenv('OPENAI_API_KEY')
        )

    async def list_documents(self, folder: Optional[str] = None) -> List[dict]:
        """List all documents with their metadata"""
        try:
            # Use admin_client instead of regular client
            query = self.supabase.admin_client.table('documents').select('*')
            if folder:
                query = query.eq('category', folder)
            
            result = query.execute()
            return result.data
        except Exception as e:
            print(f"Document Service Error: {str(e)}")
            raise e

    async def get_document_url(self, file_path: str) -> str:
        """Get a temporary URL for document download"""
        return await self.supabase.get_file_url(file_path)

    async def get_document_by_id(self, document_id: str) -> Optional[dict]:
        """Get document metadata by ID"""
        try:
            # Use admin_client and correct column name
            result = self.supabase.admin_client.table('documents')\
                .select('*')\
                .eq('document_id', document_id)\
                .execute()
            
            if not result.data:
                return None
            
            document = result.data[0]
            return document
        except Exception as e:
            print(f"Document Service Error: {str(e)}")
            raise e

    async def search_documents(self, filters: DocumentSearchFilters) -> SearchResponse:
        """Search documents using filters and pagination"""
        try:
            # Start building the query
            query = self.supabase.admin_client.table('documents').select('*', count='exact')

            # Apply text search if query provided
            if filters.query:
                query = query.or_(
                    f"title.ilike.%{filters.query}%,"
                    f"description.ilike.%{filters.query}%"
                )

            # Apply filters
            if filters.region:
                query = query.eq('region', filters.region)
            
            if filters.category:
                query = query.eq('category', filters.category)
            
            #TODO: Fix the tags filter, it doesnt work
            if filters.tags and len(filters.tags) > 0:
                query = query.contains('tags', filters.tags)

            # Add year filter
            if filters.year:
                query = query.eq('publication_year', int(filters.year))

            # Calculate pagination
            start = (filters.page - 1) * filters.per_page
            end = start + filters.per_page - 1

            # Execute query with range
            result = query.range(start, end).execute()
            
            if not result.data:
                return SearchResponse(
                    items=[],
                    total=0,
                    page=filters.page,
                    per_page=filters.per_page,
                    total_pages=0
                )

            # Calculate total pages
            total_count = result.count
            total_pages = math.ceil(total_count / filters.per_page)

            # Get download URLs for documents
            documents = []
            for doc in result.data:
                try:
                    download_url = await self.get_document_url(doc['file_path'])
                    doc['download_url'] = download_url
                except Exception:
                    doc['download_url'] = None
                documents.append(DocumentResponse(**doc))

            return SearchResponse(
                items=documents,
                total=total_count,
                page=filters.page,
                per_page=filters.per_page,
                total_pages=total_pages
            )

        except Exception as e:
            print(f"Search Error: {str(e)}")
            raise e

    def document_exists(self, file_name: str) -> bool:
        response = self.supabase.table('documents').select('document_id').eq('file_path', file_name).execute()
        return len(response.data) > 0

    async def process_document(self, document_id: str) -> Dict:
        """Process a document through the chunking and embedding pipeline"""
        try:
            # Get document and verify it exists
            document = await self.get_document_by_id(document_id)
            if not document:
                raise ValueError(f"Document not found: {document_id}")

            # Update status to processing
            await self._update_processing_status(
                document_id, 
                ProcessingStatus.PROCESSING
            )

            try:
                # Step 1: Process PDF into chunks
                logging.info(f"Starting PDF processing for document {document_id}")
                await pdf_batch_processor.process_pdf_to_chunks(document)
                logging.info(f"PDF processing completed for document {document_id}")
                
                # Step 2: Generate embeddings for chunks
                logging.info(f"Starting embedding generation for document {document_id}")
                await embedding_service.generate_and_store_embeddings(document_id)
                logging.info(f"Embedding generation completed for document {document_id}")
                
                # Update status to completed
                await self._update_processing_status(
                    document_id, 
                    ProcessingStatus.COMPLETED
                )
                
                return await self.get_document_by_id(document_id)
                    
            except Exception as e:
                # Update status to failed if there's an error
                await self._update_processing_status(
                    document_id, 
                    ProcessingStatus.FAILED,
                    str(e)
                )
                raise
                
        except Exception as e:
            logging.error(f"Error processing document {document_id}: {str(e)}")
            raise

    async def _update_processing_status(
        self, 
        document_id: str, 
        status: ProcessingStatus, 
        error_message: Optional[str] = None
    ):
        """Update document processing status and error message if any"""
        update_data = {
            'processing_status': status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if error_message:
            update_data['error_message'] = error_message
            
        try:
            self.supabase.admin_client.table('documents')\
                .update(update_data)\
                .eq('document_id', document_id)\
                .execute()
            
            logging.info(f"Updated document {document_id} status to: {status}")
            
        except Exception as e:
            logging.error(f"Error updating document status: {str(e)}")
            raise

    async def create_document_from_upload(self, storage_path: str) -> Dict:
        """
        Extract metadata from uploaded PDF and create document record.
        Args:
            storage_path: Path of the uploaded file in Supabase storage
        Returns:
            Created document record
        """
        try:
            # Download file to temporary location
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            try:
                file_data = await self.supabase.download_file(storage_path)
                temp_file.write(file_data)
                temp_file.flush()
                
                # Load PDF content
                loader = UnstructuredPDFLoader(temp_file.name)
                doc = loader.load()[0]
                
                # Create prompt for metadata extraction
                prompt = ChatPromptTemplate.from_messages([
                    ("system", r"""You are an expert at analyzing legal and regulatory documents in the renewable energy sector.
                    Extract the following metadata from the document:
                    1. title: The official title of the document
                    2. description: A brief description of the document's content and purpose
                    3. region: The geographical region this document applies to (e.g., europe)
                    4. category: The type of document (e.g., regulations, reports)
                    5. tags: A list of relevant tags for categorizing the document
                    6. publication_year: The year the document was published
                    
                    Format your response as a JSON object with these exact field names.
                    
                    Example format:
                    {{
                        "title": "Document Title",
                        "description": "Brief description",
                        "region": "europe",
                        "category": "regulations",
                        "tags": ["renewable", "energy", "policy"],
                        "publication_year": 2024
                    }}"""),
                    ("user", f"Analyze this document and extract metadata:\n\n{doc.page_content[:2000]}")
                ])
                
                # Get metadata from LLM
                chain = prompt | self.llm
                result = chain.invoke({})
                metadata = eval(result.content)  # Convert string to dict
                
                # Add additional required fields
                metadata['file_size'] = len(file_data)
                metadata['mime_type'] = 'application/pdf'
                metadata['processing_status'] = ProcessingStatus.PENDING
                metadata['file_path'] = storage_path  # Use the original storage path
                
                # Create document record
                doc_data = DocumentBase(**metadata)
                result = self.supabase.admin_client.table('documents')\
                    .insert(doc_data.model_dump())\
                    .execute()
                
                return result.data[0]
                
            finally:
                # Clean up temporary file
                temp_file.close()
                os.unlink(temp_file.name)
                
        except Exception as e:
            logging.error(f"Error creating document from upload: {str(e)}")
            raise

# Create a singleton instance
document_service = DocumentService()