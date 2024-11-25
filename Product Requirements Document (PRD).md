# Product Requirements Document (PRD)

## GreenReguAI


## Introduction

### Purpose

The purpose of this Product Requirements Document (PRD) is to outline the requirements and specifications for **GreenReguAI**, a web application designed to provide companies in the renewable energy sector with an accessible, up-to-date repository of global laws and regulations. This document serves as a guide for the development team to deliver an MVP (Minimum Viable Product) that meets the needs of its target users.

### Scope

This PRD covers the functional and non-functional requirements of GreenReguAI, including user interactions, system architecture, technology stack, and integration points. It also outlines the assumptions, dependencies, constraints, and risks associated with the project.

### Definitions, Acronyms, and Abbreviations

- **MVP:** Minimum Viable Product
- **LLM:** Large Language Model
- **API:** Application Programming Interface
- **UI/UX:** User Interface/User Experience
- **i18n:** Internationalization
- **n8n:** An extendable workflow automation tool
- **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.6+

---

## Background

### Problem Statement

Companies operating in the renewable energy sector face significant challenges in navigating the complex and diverse legal frameworks across different countries. The energy industry is heavily regulated, and staying compliant requires continuous monitoring of laws and regulations that vary widely between jurisdictions. This complexity is amplified for companies operating internationally, often necessitating large teams of legal experts, which is both costly and time-consuming.

### Project Overview

GreenReguAI aims to solve this problem by providing a centralized, continually updated repository of relevant laws and regulations related to renewable energy worldwide. The platform will offer an intuitive, AI-powered interface that allows users to query the database and receive precise, actionable information, complete with direct links to official documents in both English and their original languages.

---

## Objectives and Goals

- **Primary Objective:** Develop an MVP of GreenReguAI that allows users to access a comprehensive database of renewable energy laws and regulations through an AI-powered chat interface. The MVP will be related to the EU regulation on renewables for now, while the full product will be extended to collect the regulation from most of the world.
- **Goals:**
    - Provide up-to-date information on renewable energy regulations for all countries.
    - Enable users to interact with the database using natural language queries.
    - Link responses to specific sections of official documents for verification.
    - Offer documents in both English and original languages.
    - Automate the data ingestion and updating process using workflow automation tools.

---

## User Personas and Use Cases

### User Profiles

1. **Legal Analysts:**
    - Need to stay updated on international energy laws.
    - Require accurate sourcing for compliance reports.
2. **Energy Company Executives:**
    - Seek high-level summaries of regulations affecting strategic decisions.
    - Need quick access to official documents for due diligence.
3. **Compliance Officers:**
    - Responsible for ensuring company adherence to laws.
    - Require detailed, actionable regulatory information.
4. **Policy Researchers:**
    - Analyze regulatory trends across different regions.
    - Need comprehensive data sets for research purposes.

### User Stories

1. **As a Legal Analyst,** I want to query the platform about specific regulations in a country so that I can update compliance documents.
2. **As an Energy Company Executive,** I want to receive summaries of regulatory changes to make informed strategic decisions.
3. **As a Compliance Officer,** I want to access specific clauses in official documents to ensure company policies are compliant.
4. **As a Policy Researcher,** I want to download datasets of regulations for comparative analysis.

---

## Product Features and Requirements

### Functional Requirements

1. **AI-Powered Chat Interface:**
    - Users can input natural language queries.
    - The system responds with relevant information and links to sources.
    - Each query consumes credits from the user's balance.
2. **Document Repository:**
    - Store and manage laws and regulations from all countries.
3. **Search Functionality:**
    - Users can search for documents manually using keywords, filters, and categories.
4. **Direct Linking:**
    - Responses include links to specific sections of official documents.
5. **User Authentication and Management:**
    - Required user registration and login.
    - User profile management.
    - Credit balance tracking.
6. **Payment System:**
    - Integration with Stripe for credit purchases.
    - Initial 50 free credits for new users.
    - Credit consumption tracking.
    - Feedback system with credit rewards.
    - Refund request system for unsatisfactory responses.
7. **Multi-Language Support (Future Scope):**
    - Interface support for multiple languages.
    - Document translation capabilities.
8. **Automated Data Ingestion (Future Scope):**
    - Automated collection of regulations from official sources.

### Non-functional Requirements

1. **Performance:**
    - Quick response times for user queries (ideally under 2 seconds).
2. **Scalability:**
    - System should handle increasing numbers of users and data volume.
3. **Security:**
    - Secure data transmission using SSL/TLS.
    - Protect sensitive data and comply with data protection laws.
4. **Usability:**
    - Intuitive UI/UX design for ease of use.
5. **Reliability:**
    - High availability with minimal downtime.
6. **Maintainability:**
    - Modular codebase for easy updates and maintenance.

---

## Technical Requirements

### Technology Stack

- **Frontend:**
    - **Language:** JavaScript
    - **Framework:** React.js
    - **Libraries:** Redux or Context API for state management
- **Backend:**
    - **Language:** Python
    - **Framework:** FastAPI
    - **Libraries:**
        - Pydantic for data validation
        - Asyncio for asynchronous operations
        - Langchain for LLM integration and PDF processing
        - Unstructured API for PDF parsing
- **Database:**
    - **Primary Database:** Supabase
    - **Vector Database:** Pinecone for semantic search
- **Authentication:**
    - **Authentication tool:** Supabase
- **Payment Processing:**
    - **Service:** Stripe
- **AI Integration:**
    - **Framework:** Langchain
    - **LLM Options:** OpenAI GPT-4, Anthropic Claude, or Meta Llama
    - **Embedding:** OpenAI Ada Embedding Model

### Payment and Credit System

1. **Credit System:**
    - 1 credit = 1 standard LLM query
    - New users receive 50 free credits
    - Premium features (future scope) may cost additional credits
    - Competitive pricing strategy to balance accessibility and profitability

2. **Feedback and Refund System:**
    - Users earn 5 credits for providing detailed feedback
    - Feedback includes:
        - Numerical rating (1-5)
        - Brief explanation of rating
    - Refund requests due to significant bugs / useless answers require:
        - Detailed explanation of issue
        - Specific chat thread reference
        - Human review process for approval
        - Partial or full credit refund based on review

3. **Payment Processing:**
    - Secure credit purchase through Stripe
    - Multiple credit package options
    - Automated credit balance updates
    - Transaction history tracking

### System Architecture

### **Frontend Components:**

1. **Chat Interface Component**
2. **Document Viewer Component**
3. **Search Bar and Filters**
4. **Language Selector**

### **Backend Services:**

1. **API Gateway:**
    - Routes requests to appropriate services.
2. **Authentication Service:**
    - Manages user sessions and permissions.
3. **Query Processor:**
    - Handles user queries, interacts with the LLM, and retrieves data.
4. **Data Service:**
    - Manages interactions with MongoDB and the vector database.
5. **LLM Integration Service:**
    - Interfaces with the chosen LLM.
6. **Workflow Automation Service:**
    - Receives data from n8n workflows for database updates.

### **Data Flow:**

1. **User Interaction:**
    - User submits a query via the React frontend.
2. **Backend Processing:**
    - FastAPI backend receives the query.
    - Query Processor retrieves relevant documents using the vector database.
    - Constructs a prompt for the LLM.
3. **LLM Response:**
    - LLM Integration Service sends the prompt to the chosen LLM through an API.
    - Receives response and forwards it to the Query Processor.
4. **Response Delivery:**
    - Backend sends the response to the frontend.
    - Frontend displays the answer along with links to source documents.

### Integration Points

- **Hugging Face Inference API:**
    - For natural language understanding and response generation.
- **n8n Workflows:**
    - For automated data ingestion and database updates.
- **Vector Database (Pinecone):**
    - For semantic search capabilities.
- **Third-party APIs (Future Scope):**
    - Potential integration with legal databases or translation services.

---

## Assumptions and Dependencies

- **Assumptions:**
    - Users have internet access and modern web browsers.
    - Official documents are accessible for scraping or API retrieval.
    - Langchain access remains available and affordable.
- **Dependencies:**
    - Reliability of Langchain.
    - Availability of translation services or multilingual documents.

---

## Constraints

### Time Constraints

- **Project Timeline:** One month to develop the MVP as part of the "6 Cleantech AI Startups in 6 Months" initiative.

### Resource Constraints

- **Development Team:** Solo developer.
- **Budget:** Limited, prioritizing cost-effective solutions.

---

## Risks and Mitigations

| **Risk** | **Likelihood** | **Impact** | **Mitigation Strategy** |
| --- | --- | --- | --- |
| Hugging Face Inference API rate limits or cost overruns | Medium | High | Implement caching, optimize prompts, monitor usage closely. |
| Legal issues with scraping and distributing official documents | High | High | Verify permissions, focus on publicly available data, consult legal advice if necessary. |
| Complexity of integrating n8n workflows | Medium | Medium | Allocate time for learning, start with simple workflows, seek community support. |
| Scalability issues with increasing data volume | Low | Medium | Design with scalability in mind, consider cloud services that auto-scale. |
| Technical challenges with new technologies (React, FastAPI) | Medium | Medium | Utilize online resources, tutorials, and community forums for support. |
| Data accuracy and reliability | High | High | Implement validation checks, source data from reputable sources, allow user feedback. |

---

## Appendices

### Appendix A: Workflow Automation with n8n

- **Data Sources:**
    - Official government websites
    - International regulatory bodies
    - Legal databases
- **Workflow Steps:**
    1. **Data Extraction:**
        - Scrape or download documents from data sources.
    2. **Data Transformation:**
        - Convert documents into a consistent format.
        - Extract metadata (country, date, regulatory body, etc.).
    3. **Data Loading:**
        - Push transformed data into MongoDB and update the vector database.
    4. **Scheduling:**
        - Set up periodic checks for updates (e.g., daily, weekly).

### Appendix B: LLM Integration Details

- **Prompt Engineering:**
    - Structure prompts to include user query and relevant context.
    - Include guidelines for the LLM to provide sources and links.
- **API Usage:**
    - Monitor API usage to stay within budget.
    - Implement error handling for API failures.

### Appendix C: Internationalization (i18n)

- **Languages Supported:**
    - English (primary)
    - Original languages of documents (as available)
- **Implementation:**
    - Use `react-i18next` for language toggling in the frontend.
    - Store translations in a standardized format (e.g., JSON files).

---

## Conclusion

This PRD outlines the roadmap for developing GreenReguAI, focusing on delivering an MVP that meets the essential needs of users in the renewable energy sector. By leveraging modern technologies like React.js, FastAPI, and LLama 3 model through Hugging Face Inference API, the project aims to provide a valuable tool that simplifies the complex task of navigating international energy regulations.

The document serves as a comprehensive guide for the development process, ensuring that all team members (even though currently a solo developer) are aligned with the project's objectives and requirements. With careful planning, risk management, and a focus on scalability and user experience, GreenReguAI has the potential to become an indispensable resource in the renewable energy industry.