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

### Example of a chunk

chunk_id: 01932a20-f9ac-40c9-b4f5-6ce17f79786d
document_id: e7eb4949-5c10-42c6-8a12-f572959395f6
content: Support Facility for the implementation of the EU-Japan 
Strategic Partnership Agreement (SPA) 
EuropeAid/139636/DH/SER/JP 
 15 
For the purpose of protection and cultivation of aquatic organisms, etc. 
 
Protected Water Surface (Act on the Protection of Marine Resources) 
Coastal Fisheries Resources Development Area, Designated Sea Area (Marine 
Resources Development Promotion Act) 
Common Fishery Right Area (Fishery Act) 
Other areas designated by prefectures or fishery organizations (e.g., Fishery Act, 
Act on the Protection of Marine Resources, Fishery Cooperatives Act, Prefectural 
Fisheries Adjustment Regulations, etc.) 
Fisheries Agency 
Source: Created by the author based on Ministry of the Environment's "How Marine Protected Areas Should be 
Established in Japan" (May 2011), etc. https://www.kantei.go.jp/jp/singi/kaiyou/dai8/siryou3.pdf 
 
2.2.2.4. 
Other uses 
Sea areas are also used for training and research by 
the Self-Defense Forces. When it is necessary to use 
the water surface for training, etc., the Minister of 
Defense may set a certain area and period of time to 
restrict or prohibit fishing operations. In making this 
decision, MAFF and the relevant prefectural gover-
nor's opinion shall be heard. Those who are engaged 
in the fishing industry will receive compensation for 
losses caused by the restriction or prohibition. 
In cases where air space is used in conjunction with 
the use of the sea, the laws governing the use of such 
space are also relevant. The following are particularly 
relevant to offshore wind installations. 
According to the Civil Aeronautics Act, certain spaces 
around airports must be kept free of obstructions in 
order for aircraft to take off and land safely. It is pro-
hibited to install, plant, or detain any structure, plant, 
or other object of any height that comes above cer-
tain area indicated in the public notice (restricted 
surface). In addition, if a wind power generation fa-
cility is to be constructed near VHF Omnidirectional 
Radio Range (VOR) or Distance Measuring Equip-
ment (DME) facilities that simultaneously provide az-
imuth and distance information to aircraft operating 
within the effective communication distance, notifi-
cation and consultation with the Civil Aviation Bureau 
is required. 
The Meteorological Service Act prohibits without jus-
tifiable grounds conducting any acts detrimental to 
the effects of meteorological instruments installed 
by the Japan Meteorological Agency and requires op-
erators to notify and consult with the Agency when 
wind turbines are installed in the vicinity of weather 
radar. The distance from the radar to the wind tur-
bine is based on the World Meteorological Organiza-
tion's guidance statement on weather radar/wind 
turbine siting (The CIMO Guide, 2021). 
 
17 Based on the statistics from Japan Wind Power Association as of December 2023, https://jwpa.jp/information/8034/ with the 
addition of the 112MW capacity of Ishikari Bay New Port offshore wind farm, fully commissioned in January 2024. 
18 Renewable Energy Institute, “Japan's Offshore Wind Power Potential -Territorial Sea and Exclusive Economic Zone-,“ (Decem-
ber 2023). https://www.renewable-ei.org/en/activities/reports/20231219.php 
The Ministry of Defense also requires that operators 
be consulted early in the project planning process to 
reduce the impact on radar. 
2.2.3. Status of offshore wind power 
This part shows the status of OWP in Japan, including 
policies and legal framework for the development. 
2.2.3.1. 
Current project capacity and pol-
icy target 
Japan, as of June 2024, has deployed offshore wind 
with capacity of approximately 300 MW, including 
5MW of floating, and 34MW of nearshore ones17. At 
the same time, the potential for offshore wind power 
in Japan is large, more than 1100 GW18. 
Policies which promote offshore wind deployment 
have been promoted in recent 10 years. The Head-
quarters for Ocean Policy in the Cabinet Office, in its 
policy from 2012, has defined a series of issues re-
lated to the practical viability and commercialization 
of offshore wind power, including coordination with 
other stakeholders in sea area utilization, clarifica-
tion of related utilization rules, appropriate environ-
mental impact assessments, and cost reductions, 
and in its Basic Plan on Ocean Policy, specific govern-
ment initiatives have been formulated. Deficiencies 
in sea area utilization rules, and long-term occu-
pancy rights in particular, were addressed through 
legislation, and for ports areas, the Port and Harbor 
Act was amended in 2016; and, for territorial sea ar-
eas other than port areas, a new framework, the Act 
on Promoting the Utilization of Sea Areas for the De-
velopment of Marine Renewable Energy Power Gen-
eration Facilities (hearinafter referred to as the 
Renewable Energy Sea Area Utilization Act), was cre-
ated that links long-term occupancy and the financial 
support scheme (FiT or FiP).

metadata: null (i dont know what's this column for)
created_at: 2024-12-17 01:01:48.196334+00
updated_at: 2024-12-17 01:01:48.196334+00
page_number: 15
section_title: EMPTY
chunk_index: 0
start_offset: 0
end_offset: 4979
category: Text
location_data: {"bbox": {"x0": 184.32000732421875, "x1": 216.57492065429688, "y0": 14.210585594177246, "y1": 25.077880859375}, "pdf_coordinates": {"page": 15, "position": [184.32000732421875, 14.210585594177246]}}
element_tyoe: null
font_info: null
context: {"next": null, "previous": null} (sometimes the pdf processing procedure is able to gather context, like in here: {
  "next": "(2018). Impacts of onshore wind energy production on birds and bats: \nrecommendations for future life cycle impact assessment developments. The International Journal of Life Cycle Assessment, \n23, 200",
  "previous": "e montanus)71. \nHowever, other studies report different results for some of these species; for example, a \nsystematic review of 84 peer-reviewed studies of onshore wind power identified no \n \n63 IUCN."
})