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
- [ ]  **Create Wireframes for Core Pages**
    - [ ]  Use a v0 or bolt.new:
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

- [ ]  **Set Up Document Storage Infrastructure**
    - [x]  Configure Supabase Storage for official PDFs
    - [ ]  Create document metadata tables in Supabase:
        - [x]  Documents table (title, date, region, category)
        - [ ]  Document chunks table
        - [ ]  Document references table
    - [ ]  Set up Pinecone for vector storage
    - [ ]  Create necessary backend services and models

- [ ]  **Document Processing Pipeline**
    - [ ]  Implement document processing service:
        - [ ]  PDF text extraction
        - [ ]  Text chunking strategy
        - [ ]  Embedding generation
    - [ ]  Create reference system between chunks and sources
    - [ ]  Process initial set of official documents
    - [ ]  Store documents and generate embeddings
    - [ ]  Implement backend APIs for document retrieval

## Phase 5: Document Library Implementation

- [ ]  **Backend - Document Library APIs**
    - [ ]  Create endpoints for document listing
    - [ ]  Implement filtering and search functionality
    - [ ]  Add document metadata retrieval
    - [ ]  Set up PDF serving endpoints

- [ ]  **Frontend - Document Library Interface**
    - [ ]  Enhance existing Document Library page:
        - [ ]  Add document browsing interface
        - [ ]  Implement filtering system
        - [ ]  Add document preview functionality
        - [ ]  Implement metadata-based search
    - [ ]  Create document detail view
    - [ ]  Add PDF viewer integration

## Phase 6: AI Assistant Integration

- [ ]  **Backend - Set Up RAG System**
    - [ ]  Install and configure Langchain
    - [ ]  Implement vector similarity search
    - [ ]  Create prompt engineering system
    - [ ]  Set up response generation with citations
    - [ ]  Implement citation verification system

- [ ]  **Backend - AI Query Endpoint**
    - [ ]  Create API endpoint for AI queries
    - [ ]  Implement credit deduction logic
    - [ ]  Add source reference generation
    - [ ]  Handle error cases and rate limiting

- [ ]  **Frontend - Enhance AI Chat Interface**
    - [ ]  Update existing chat interface:
        - [ ]  Add support for cited responses
        - [ ]  Implement clickable citations
        - [ ]  Add document preview modal
        - [ ]  Improve error handling
    - [ ]  Add loading states and animations
    - [ ]  Implement credit balance display

---

## Phase 7: Implementing the Credit System

- [ ]  **Frontend - Display Credit Balance**
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
    - [ ]  Display available credit packages and pricing.
    - [ ]  Implement purchase buttons initiating Stripe checkout.
- [ ]  **Frontend - Handle Post-Purchase Flow**
    - [ ]  Confirm purchase success.
    - [ ]  Update credit balance on the UI.
    - [ ]  Redirect users appropriately after payment.

---

## Phase 9: Testing Core Functionality

- [ ]  **Conduct Unit and Integration Testing**
    - [ ]  Write tests for backend functions:
        - [ ]  Authentication
        - [ ]  Credit deduction
        - [ ]  Payment processing
    - [ ]  Test frontend components and forms.
- [ ]  **Perform End-to-End Testing**
    - [ ]  Simulate user journeys:
        - [ ]  Registering and logging in
        - [ ]  Making AI queries
        - [ ]  Purchasing credits
    - [ ]  Ensure seamless feature integration.

---

## Phase 10: Expanding Functionality

- [ ]  **Implement Search Functionality**
    - [ ]  **Backend:**
        - [ ]  Create endpoints for search queries.
        - [ ]  Implement database queries for documents.
    - [ ]  **Frontend:**
        - [ ]  Build the Search Page with filters.
        - [ ]  Display search results.
- [ ]  **Build Document Detail Page**
    - [ ]  Display detailed regulation information.
    - [ ]  Include download links for documents.

---

## Phase 11: Refining UI/UX Design

- [ ]  **Apply Consistent Styling**
    - [ ]  Choose a CSS framework or design system.
    - [ ]  Apply consistent fonts, colors, and spacing.
- [ ]  **Improve Navigation and Accessibility**
    - [ ]  Implement a responsive navigation menu.
    - [ ]  Ensure keyboard accessibility.
    - [ ]  Add ARIA labels where necessary.
- [ ]  **Optimize for Responsive Design**
    - [ ]  Test layouts on various screen sizes.
    - [ ]  Adjust styles for mobile, tablet, and desktop.

---

## Phase 12: Final Testing and Deployment

- [ ]  **Conduct Thorough Testing**
    - [ ]  Revisit all user flows.
    - [ ]  Test under different network conditions.
    - [ ]  Verify security measures.
- [ ]  **Prepare for Deployment**
    - [ ]  Set up hosting for the frontend.
    - [ ]  Set up hosting for the backend.
    - [ ]  Configure environment variables securely.
    - [ ]  Set up SSL certificates.
- [ ]  **Deploy the Application**
    - [ ]  Deploy the backend API.
    - [ ]  Deploy the frontend application.
    - [ ]  Perform smoke tests in production.
- [ ]  **Set Up Monitoring and Logging**
    - [ ]  Implement backend logging.
    - [ ]  Set up performance and uptime monitoring.


