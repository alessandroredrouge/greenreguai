# AI Assistant Implementation Plan

Use this checklist to track progress on implementing the AI Assistant functionality.

---

## Phase 1: Backend RAG Service Setup

### Core RAG Implementation
- [x] **Set Up Basic RAG Service**
    - [x] Configure LangChain with OpenAI
    - [x] Create base prompt template
    - [x] Implement document retrieval from Pinecone
    - [x] Set up basic response generation
- [x] **Document Processing**
    - [x] Create chunk metadata structure
    - [x] Implement context formatting
    - [x] Add source document tracking
- [x] **Response Formatting**
    - [x] Design response structure with citations
    - [x] Implement response parsing
    - [x] Add metadata extraction

### API Endpoints
- [ ] **Create FastAPI Routes**
    - [x] Set up chat endpoint
    - [ ] Add authentication middleware
    - [x] Implement error handling
- [x] **Request/Response Models**
    - [x] Define Pydantic models for chat
    - [x] Create response schemas
    - [x] Add validation rules

---

## Phase 2: Citation System

### Backend Implementation
- [x] **Source Tracking**
    - [x] Create citation data structure
    - [x] Implement source document linking
    - [x] Add page/section tracking
- [ ] **PDF Integration**
    - [x] Add PDF location tracking
    - [ ] Implement chunk-to-PDF mapping
    - [ ] Create preview generation system
- [x] **Citation Storage**
    - [x] Design citation storage schema
    - [x] Implement citation saving
    - [x] Add citation retrieval system

### API Integration
- [ ] **Citation Endpoints**
    - [ ] Create citation retrieval endpoint
    - [ ] Add PDF preview endpoint
    - [ ] Implement source verification routes

---

## Phase 3: Credit System Integration

### Credit Management
- [ ] **Credit Checking**
    - [x] Implement credit verification
    - [ ] Add insufficient credit handling (optional)
- [ ] **Credit Processing**
    - [x] Fix credit deduction on Supabase (we use triggers)
    - [ ] Create refund mechanism (optional)

### Transaction Tracking
- [ ] **Usage Monitoring**
    - [x] Create usage tracking system
    - [ ] Implement analytics collection (optional)
    - [ ] Add usage reporting (optional)

---

## Phase 4: Chat History & Context

### Conversation Management
- [x] **History Storage**
    - [x] Design conversation schema
    - [x] Implement history saving
    - [x] Add conversation retrieval
- [x] **Context Processing**
    - [x] Add relevance scoring

### Conversation Features
- [x] **Conversation Control**
    - [x] Add conversation saving
    - [x] Implement conversation loading

---

## Phase 5: Frontend Integration


### UI Enhancement
- [x] **Citation Display**
    - [x] Create citation component
    - [x] Implement PDF preview
    - [x] Add source navigation

---



## Phase 6: New additions

### User Accounts
- [ ] **New account creation**
    - [ ] Ensure that new users can signup
    - [ ] Improve signup / signin page in terms of clarity
- [ ] **Account signin**
    - [ ] Add a functioning reset password procedure

### Stripe
- [ ] **Payments**
    - [ ] Add stripe component to handle buying credits
    - [ ] Integrate it with the platform
    - [ ] Test the process and verify it works smoothly

### Other improvements
- [ ] **AI Assistant**
    - [ ] For new conversations, show a couple of predetermined questions to the user, exctracted randomly from a list of premade questions, that he can click on to copy it in the chat and ask that question, so that the user can then test the functionalities of the software properly
- [ ] **Document Library**
    - [ ] Introduce pagination when fetching documents
    - [ ] Reach 100 relevant documents saved in the library and processed
    - [ ] test the webapp performances and evantually make changes to make it acceptable
- [ ] **Billing & Credits**
    - [ ] Update the page with actual prices
    - [ ] Link it to Stripes component
- [ ] **Landing page**
    - [ ] Update prices part with new prices
    - [ ] Add a section with a video (or multiple gifs with some text describing them on the side in order, so that one by scrolling doen the landing page can see the functionalities of the software in an easy / intuitive way, which is even better) showing the functionalities of the webapp

### Publishing
- [ ] **Tests**
    - [ ] test that everything works on desktop
    - [ ] test that everything works on mobile
    - [ ] Make eventual changes
- [ ] **Publish**
    - [ ] Find a platform where to publish this webapp
    - [ ] Set it up
    - [ ] Publish
    - [ ] Make a few people aware of it, and make them do betatesting
    - [ ] Fix issues
    - [ ] Make Linkedin posts and X to make the big public aware of it
    

## Notes:
- Each phase should be completed before moving to the next
- Testing should be done throughout each phase
- Documentation should be updated as features are implemented
- Regular performance monitoring should be maintained
