# Step-by-Step Development Guide for GreenReguAI MVP

Use this checklist to guide your development process. You can tick off each item as you complete it.

---

## Phase 1: Planning and Setup

- [x]  **Set Up Version Control and Project Repository**
    - [x]  Initialize a Git repository for your project.
    - [x]  Create a remote repository on GitHub, GitLab, or Bitbucket.
- [x]  **Establish Project Structure**
    - [x]  **Frontend:**
        - [x]  Initialize a React.js project using `create-react-app` or similar.
        - [x]  Set up folders for components, pages, assets, and services.
    - [x]  **Backend:**
        - [x]  Set up a Python virtual environment.
        - [x]  Initialize a FastAPI project.
        - [x]  Organize folders for routers, models, schemas, services, and database interactions.
- [x]  **Install Necessary Dependencies**
    - [x]  **Frontend:**
        - [x]  Install React Router.
        - [x]  Install Axios for API calls.
        - [x]  Install UI libraries (e.g., Material-UI, Bootstrap).
    - [x]  **Backend:**
        - [x]  Install FastAPI and Uvicorn.
        - [x]  Install Pydantic for data validation.
        - [x]  Install Supabase Python client.
        - [x]  Install Langchain for LLM integration.

---

## Phase 2: Designing User Flows and Wireframes

- [x]  **Define User Stories and Flows**
    - [x]  Revisit user personas and stories from the PRD.
    - [x]  Map out user journeys for:
        - [x]  Registration
        - [x]  Logging in
        - [x]  Querying the AI
        - [x]  Purchasing credits
- [x]  **Create Wireframes for Core Pages**
    - [x]  Use a v0 or bolt.new:
        - [x]  Home/Landing Page
        - [x]  Sign Up/In Page
        - [x]  Dashboard
        - [x]  AI Chat Interface
        - [x]  Document Search Interface
        - [x]  Billing Page

---

## Phase 3: Implementing User Authentication

- [x]  **Backend - Set Up Supabase Authentication**
    - [x]  Create a project on Supabase.
    - [x]  Configure authentication for email/password sign-up and login.
    - [x]  Set up user tables and configure policies.
- [x]  **Frontend - Develop Authentication Pages**
    - [x]  Build the **Sign Up** page with form validation and error handling.
    - [x]  Build the **Login** page with form validation and error handling.
    - [x]  Connect the forms to Supabase authentication APIs.
- [x]  **Implement Protected Routes**
    - [x]  Ensure only authenticated users can access protected pages.
    - [x]  Implement route guards or higher-order components in React.

---

## Phase 4: Document Management System Setup

- [x]  **Set Up Document Storage Infrastructure**
    - [x]  Configure Supabase Storage for official PDFs
    - [x]  Create document metadata tables in Supabase:
        - [x]  Documents table (title, date, region, category)
        - [x]  Document chunks table
    - [x]  Implement Document Search Functionality
        - [x]  Backend part
        - [x]  Frontend part

## Phase 5: Document Library Implementation

- [x]  **Backend - Document Library APIs**
    - [x]  Create endpoints for document listing
    - [x]  Implement filtering and search functionality
    - [x]  Add document metadata retrieval
    - [x]  Set up PDF serving endpoints

- [ ]  **Frontend - Document Library Interface**
    - [x]  Enhance existing Document Library page:
        - [x]  Add document browsing interface
        - [x]  Implement filtering system
        - [x]  Implement metadata-based search
    - [x]  Create document detail view
    - [ ]  Add PDF viewer integration


## Phase 6: AI Assistant Integration

- [ ]  **Document Processing Pipeline**
    - [x]  PDF Processing Service:
        - [x]  Create code to extract text from PDFs
        - [x]  Clean and preprocess text in chunks
        - [x]  Maintain structural information (sections, pages) and infos about where to locate the chunk in the pdf
        - [x] connect this service to Supabase (currently it's done locally to test it out)
    - [ ]  Chunking Service:
        - [x]  Implement semantic text splitting
        - [x]  Create chunk metadata schema
        - [x]  Store chunks with references to its location in the document
        - [ ] configure integration with Supabase so that every new document that is uploaded in the official_documents bucket is processed and chunked, saving the results of this process in Supabase and embedding & saving those chunks in Pinecone
    - [x]  Embedding Service:
        - [x]  Set up OpenAI embedding generation
        - [x]  Configure Pinecone integration
        - [x]  Store embeddings with metadata

- [ ]  **Query Processing System**
    - [ ]  Query Handler (core Langchain, accessing Supabase/Pinecone):
        - [ ]  Implement query preprocessing
        - [ ]  Integrate with conversation tracking
        - [ ]  Connect to credit system
    - [ ]  Retrieval System (core Langchain, accessing Supabase/Pinecone):
        - [ ]  Implement embedding-based search
        - [ ]  Set up context fetching
        - [ ]  Optimize retrieval relevance
    - [ ]  Response Generator (core Langchain, accessing Supabase/Pinecone):
        - [ ]  Design prompt engineering system
        - [ ]  Implement LangChain + OpenAI integration
        - [ ]  Create citation generation system based on the chunkcs saved

- [ ]  **Backend API Development**
    - [ ]  Create chat endpoint
    - [ ]  Implement citation retrieval
    - [ ]  Add feedback handling
    - [ ]  Set up error handling
    - [ ]  Add logging system

- [ ]  **Frontend Enhancement**
    - [ ]  Update chat interface:
        - [ ]  Add citation display
        - [ ]  Implement hover previews
        - [ ]  Add confidence indicators
    - [ ]  Create citation components:
        - [ ]  Add clickable citations
        - [ ]  Build document preview modal
        - [ ]  Implement section navigation
    - [ ]  Add feedback system:
        - [ ]  Create feedback UI
        - [ ]  Implement response saving
        - [ ]  Add error reporting

---

## Phase 7: Implementing the Credit System

- [x]  **Frontend - Display Credit Balance**
    - [x]  Show the user's current credit balance on:
        - [x]  Dashboard
        - [x]  AI Chat Interface
- [ ]  **Frontend - Handle Low Credit Scenarios (Optional)**
    - [ ]  Notify users when credits are low.
    - [ ]  Prompt users to purchase more credits.
- [ ]  **Backend - Implement Feedback Rewards (Optional)**
    - [ ]  Develop logic to award credits for user feedback.
    - [ ]  Create an endpoint to handle feedback submissions.

---

## Phase 8: Integrating Payment Processing with Stripe

- [ ]  **Backend - Set Up Stripe Integration**
    - [ ]  Create a Stripe account and obtain API keys.
    - [ ]  Implement backend endpoints to create checkout sessions.
    - [ ]  Handle webhook events to confirm payments and update credits.
- [ ]  **Frontend - Build the Billing/Credits Page**
    - [ ]  Display available credit packages and pricing (to be decided yet).
    - [ ]  Implement purchase buttons initiating Stripe checkout.
- [ ]  **Frontend - Handle Post-Purchase Flow**
    - [ ]  Confirm purchase success.
    - [ ]  Update credit balance on the UI.
    - [ ]  Redirect users appropriately after payment.

---

## Phase 9: Final Testing and Deployment
- [ ]  **Optimize for Responsive Design**
    - [ ]  Test layouts on various screen sizes.
    - [ ]  Adjust styles for mobile, tablet, and desktop.
- [ ]  **Conduct Thorough Testing**
    - [ ]  Revisit all user flows.
    - [ ]  Test under different network conditions.
    - [ ]  Verify security measures.
- [ ]  **Prepare for Deployment**
    - [ ]  Set up hosting for the frontend.
    - [ ]  Set up hosting for the backend.
    - [ ]  Configure environment variables securely.
    - [ ]  Change API links of Supabase related services from the ones of ngrok, which was redirecting to your localhost, to the one used in production.
    - [ ]  Set up SSL certificates.
- [ ]  **Deploy the Application**
    - [ ]  Deploy the backend API.
    - [ ]  Deploy the frontend application.
    - [ ]  Perform smoke tests in production.
- [ ]  **Set Up Monitoring and Logging**
    - [ ]  Implement backend logging.
    - [ ]  Set up performance and uptime monitoring.


