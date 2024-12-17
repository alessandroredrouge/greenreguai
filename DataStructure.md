# Data Structure Documentation

This document outlines the database architecture and data flow for GreenReguAI, particularly focusing on how different components interact to support the AI Assistant functionality.

## Overview

The application uses a hybrid storage approach combining Supabase and Pinecone:

### Supabase
- Primary database and authentication system
- Handles document storage and metadata
- Manages user data and credits
- Stores conversation history and chunks

### Pinecone
- Vector database for semantic search
- Stores embeddings of document chunks
- Enables efficient similarity search for RAG (Retrieval Augmented Generation)
- Maintains references to original chunks in Supabase

## Storage Architecture

### 1. Supabase Storage

#### Official Documents Bucket (`official_documents`)
Stores the original PDF documents that serve two critical purposes:

1. **Document Processing**
   - Source files for initial processing
   - Text extraction and chunking
   - Metadata extraction
   - Embedding generation

2. **Reference System**
   - Enables direct navigation to source citations
   - Allows users to verify AI Assistant responses
   - Provides context for chunks in their original format

### 2. Supabase Database Tables

#### User Profiles (`user_profiles`)
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users.id,
    email TEXT,
    full_name TEXT,
    credits INT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

#### Documents (`documents`)
```sql
CREATE TABLE documents (
    document_id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    file_path TEXT,
    file_size INT,
    mime_type TEXT,
    region TEXT,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    url_source TEXT,
    publication_year TEXT,
    processing_status processing_status_enum,
    error_message TEXT
);
```

#### Chunks (`chunks`)
```sql
CREATE TABLE chunks (
    chunk_id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(document_id),
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    page_number INT,
    section_title TEXT,
    chunk_index INT,
    start_offset INT,
    end_offset INT,
    category TEXT,
    location_data JSONB,
    element_type TEXT,
    font_info JSONB,
    context JSONB
);
```

#### Conversations (`conversations`)
```sql
CREATE TABLE conversations (
    conversation_id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users.id,
    title TEXT,
    total_credits_used INT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

#### Messages (`messages`)
```sql
CREATE TABLE messages (
    message_id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(conversation_id),
    user_id UUID REFERENCES auth.users.id,
    role TEXT,
    content TEXT,
    credits_used INT,
    created_at TIMESTAMPTZ
);
```

#### Credit Transactions (`credit_transactions`)
```sql
CREATE TABLE credit_transactions (
    transaction_id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users.id,
    amount INT,
    transaction_type transaction_type,
    description TEXT,
    conversation_id UUID REFERENCES conversations(conversation_id),
    promotion_id UUID,
    created_at TIMESTAMPTZ,
    status transaction_status,
    stripe_payment_id TEXT,
    message_id UUID REFERENCES messages(message_id)
);
```

### 3. Pinecone Vector Database

Stores vector embeddings of document chunks with the following structure:

```json
{
    "id": "chunk_uuid",
    "values": [/* vector embedding values */],
    "metadata": {
        "chunk_id": "uuid_from_supabase_chunks_table",
        "document_id": "uuid_from_supabase_documents_table",
        "text": "original_chunk_text"
    }
}
```

## Document Processing Flow

1. **Document Upload**
   - PDF uploaded to Supabase `official_documents` bucket
   - Document metadata extracted and stored in `documents` table

2. **Document Processing**
   - Text extracted from PDF
   - Document divided into semantic chunks
   - Chunk metadata captured (page numbers, positions, etc.)
   - Chunks stored in `chunks` table
   - Embeddings generated for each chunk

3. **Vector Storage**
   - Chunk embeddings stored in Pinecone
   - Metadata references maintained between Pinecone and Supabase

## AI Assistant Functionality

### Query Processing
1. User submits a query
2. Query is embedded and similar chunks are retrieved from Pinecone
3. Retrieved chunks are used as context for the AI response
4. AI generates answer with specific citations

### Citation System
1. Each part of the AI's answer is linked to specific chunks
2. Users can click on citations to:
   - View the original chunk text
   - See document source and page number
   - Navigate to exact position in original PDF
3. Citation verification flow:
   - Click citation → Retrieve chunk from Supabase → Load PDF → Navigate to specific location

### Credit System
- Credits required for AI Assistant queries
- Credit transactions recorded in `credit_transactions`
- User balance maintained in `user_profiles`
- Automated triggers ensure sufficient credits

## Key Features Enabled by This Architecture

1. **Source Verification**
   - Direct links between AI responses and source documents
   - Precise navigation to cited content
   - Full context preservation

2. **Semantic Search**
   - Efficient similarity search through Pinecone
   - Relevant chunk retrieval for accurate responses
   - Maintenance of document relationships

3. **User Management**
   - Credit system integration
   - Conversation history tracking
   - Usage monitoring and limitations

4. **Document Management**
   - Structured storage of source materials
   - Efficient chunk retrieval
   - Metadata preservation