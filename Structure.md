# GreenReguAI Frontend Pages Structure with Associated Tools & Technologies

Use this document to understand the structure of the pages needed for the frontend of GreenReguAI. Each page includes its purpose, content, layout, how it connects with other pages, and the tools and technologies used to implement it.

---

## 1. Home/Landing Page

**Purpose:**

- Introduce GreenReguAI to visitors.
- Highlight key features and benefits.
- Encourage users to sign up or log in.

**Content & Layout:**

- As we already did it

**Interconnections:**

- **Sign Up Page:** Via the "Sign Up" button (or equivalent).
- **Login Page:** Via the "Log In" button  (or equivalent).
- **FAQ/Help Page:** Link in the footer.
- **Contact Us Page:** Link in the footer.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Styling:** CSS or a CSS framework like Tailwind CSS or Bootstrap
- **Backend:**
    - Not applicable (mostly static content)
- **Hosting:**
    - Static site hosting (e.g., Netlify, Vercel)

---

## 2. Sign Up Page

**Purpose:**

- Allow new users to create an account.

**Content & Layout:**

- **Form Fields:** Name, Email, Password, Confirm Password.
- **Terms Agreement:** Checkbox to agree to Terms of Service and Privacy Policy.
- **Sign Up Button:** Prominently below the form fields.
- **Alternative Option:** Link to "Log In" if the user already has an account.

**Interconnections:**

- **Login Page:** Via the alternative option link.
- **Dashboard:** Redirect after successful sign-up.
- **Terms of Service & Privacy Policy Pages:** Via links in the terms agreement section.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Form Validation:** Formik or React Hook Form
- **Authentication:**
    - **Service:** Supabase Auth
    - **Library:** Supabase JavaScript Client
- **Backend:**
    - **API:** FastAPI (if additional custom logic is needed)
- **Security:**
    - **Encryption:** Handled by Supabase

---

## 3. Login Page

**Purpose:**

- Allow existing users to access their accounts.

**Content & Layout:**

- **Form Fields:** Email, Password.
- **Log In Button:** Prominently below the form fields.
- **Forgot Password Link:** Below the Log In button.
- **Alternative Option:** Link to "Sign Up" for new users.

**Interconnections:**

- **Dashboard:** Redirect after successful login.
- **Sign Up Page:** Via the alternative option link.
- **Password Reset Page:** Via the "Forgot Password" link.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Form Validation:** Formik or React Hook Form
- **Authentication:**
    - **Service:** Supabase Auth
    - **Library:** Supabase JavaScript Client
- **Backend:**
    - **API:** FastAPI (if additional custom logic is needed)

---

## 4. Password Reset Page

**Purpose:**

- Enable users to reset their password if forgotten.

**Content & Layout:**

- **Form Field:** Email address to send reset instructions.
- **Submit Button:** Below the email field.
- **Confirmation Message:** Displayed after submission.

**Interconnections:**

- **Login Page:** Link to return to login.
- **Email System:** Sends password reset instructions to the user.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Authentication:**
    - **Service:** Supabase Auth password reset functionality
    - **Library:** Supabase JavaScript Client
- **Email Delivery:**
    - **Service:** Supabase handles email delivery for password resets

---

## 5. Dashboard

**Purpose:**

- Central hub for users to access all features.

**Content & Layout:**

- **Welcome Message:** Personalized greeting.
- **Credit Balance Display:** Shows remaining credits prominently.
- **Quick Actions:**
    - "Start New Query" button.
    - "Search Regulations" button.
    - "Purchase Credits" button.
- **Recent Activity:** List of recent queries and interactions.
- **Notifications:** Alerts for updates or important information.

**Interconnections:**

- **AI Chat Interface:** Via "Start New Query" button.
- **Search Page:** Via "Search Regulations" button.
- **Billing/Credits Page:** Via "Purchase Credits" button or credit balance display.
- **Profile Settings:** Accessible from a user avatar or settings icon.
- **Feedback Page:** Link in the navigation menu or footer.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **State Management:** Context API or Redux
- **Backend:**
    - **API:** FastAPI endpoints to fetch user data, credit balance, and activity logs
- **Database:**
    - **Service:** Supabase (for user profiles, credits, and activity)
- **Authentication:**
    - **Service:** Supabase Auth

---

## 6. AI Chat Interface Page

**Purpose:**

- Allow users to interact with the AI for queries.

**Content & Layout:**

- **Chat Window:** Main area where the conversation occurs.
- **Input Field:** Text box for entering queries.
- **Send Button:** To submit queries.
- **Response Display:** AI responses appear sequentially.
- **Credit Consumption Indicator:** Shows credits used per query.
- **Feedback Option:** Thumbs up/down icons or a "Provide Feedback" link after each response.

**Interconnections:**

- **Document Detail Pages:** Via links within AI responses.
- **Feedback Page:** Via feedback option.
- **Billing/Credits Page:** If credits are low, prompt to purchase more.
- **Dashboard:** Accessible via the navigation menu.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Backend:**
    - **API:** FastAPI endpoint to handle AI queries
- **AI Integration:**
    - **Framework:** Langchain (for LLM integration and RAG system)
    - **LLM:** OpenAI GPT-4 or alternative
- **Vector Search:**
    - **Service:** Pinecone (for vector embeddings and semantic search)
- **Embeddings:**
    - **Model:** OpenAI Ada Embedding Model
- **Credit Management:**
    - **Service:** Supabase (to track and deduct credits per query)
- **Authentication:**
    - **Service:** Supabase Auth

---

## 7. Search Page

**Purpose:**

- Enable manual search of regulations.

**Content & Layout:**

- **Search Bar:** Prominently at the top.
- **Filters:** Side panel or dropdowns for:
    - Country
    - Category
    - Date
    - Language
- **Results List:** Displays documents with titles, brief descriptions, and relevant metadata.
- **Pagination or Infinite Scroll:** For navigating through results.

**Interconnections:**

- **Document Detail Page:** By clicking on a search result.
- **Dashboard:** Accessible via the navigation menu.
- **Advanced Search Options:** For more detailed queries.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Backend:**
    - **API:** FastAPI endpoints for search functionality
- **Database:**
    - **Service:** Supabase (storing document metadata and content)
- **Search Capability:**
    - **Option 1:** Supabase's built-in full-text search
    - **Option 2:** Integrate with a search service like Elasticsearch (for future scalability)
- **Authentication:**
    - **Service:** Supabase Auth

---

## 8. Document Detail Page

**Purpose:**

- Provide detailed information on a specific regulation.

**Content & Layout:**

- **Document Title:** At the top.
- **Summary:** Brief overview of the regulation.
- **Download Links:** Buttons to download in English and original language.
- **Sections List:** Clickable links to specific sections or clauses.
- **Related Documents:** Suggestions for similar or relevant regulations.

**Interconnections:**

- **Download Functionality:** Initiates file download.
- **AI Chat Interface:** Option to ask questions about the document.
- **Search Page:** Back link to return to search results.
- **Dashboard:** Via the navigation menu.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Backend:**
    - **API:** FastAPI endpoints to retrieve document details
- **Database:**
    - **Service:** Supabase (for documents and metadata)
- **File Storage:**
    - **Service:** Supabase Storage or cloud storage like AWS S3
- **Authentication:**
    - **Service:** Supabase Auth

---

## 9. Billing/Credits Page

**Purpose:**

- Manage credits and handle purchases.

**Content & Layout:**

- **Credit Balance Display:** Current available credits.
- **Purchase Options:** Different credit packages with pricing.
- **Purchase Button:** Initiates the payment process.
- **Transaction History:** List of past purchases and credits used.
- **Payment Method Management:** Save or update payment information.

**Interconnections:**

- **Stripe Payment Gateway:** For secure transactions.
- **Dashboard:** Return link after purchase.
- **Profile Settings:** For managing payment methods.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Payment Integration:** Stripe.js or Stripe Elements
- **Backend:**
    - **API:** FastAPI endpoints to handle payment processing and webhooks
- **Payment Processing:**
    - **Service:** Stripe
- **Credit Management:**
    - **Database:** Supabase (to update user credits)
- **Authentication:**
    - **Service:** Supabase Auth

---

## 10. Profile Settings Page

**Purpose:**

- Allow users to manage personal information and preferences.

**Content & Layout:**

- **Personal Information:** Fields for name, email, company (if applicable).
- **Change Password:** Option to update the password.
- **Notification Preferences:** Email alerts, updates, etc.
- **Language Preferences:** For future multi-language support.
- **Save Changes Button:** To confirm updates.

**Interconnections:**

- **Dashboard:** Via the navigation menu.
- **Billing/Credits Page:** For managing payment methods.
- **Logout Functionality:** Option to log out of the account.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Form Handling:** Formik or React Hook Form
- **Backend:**
    - **API:** FastAPI endpoints to update user data
- **Database:**
    - **Service:** Supabase (for storing user profiles and settings)
- **Authentication:**
    - **Service:** Supabase Auth
- **Email Notifications:**
    - **Service:** Integration with an email service like SendGrid (for notification preferences)
- **Internationalization (Future Scope):**
    - **Library:** react-i18next

---

## 11. Feedback Page

**Purpose:**

- Collect user feedback and handle refund requests.

**Content & Layout:**

- **Feedback Form:**
    - Select the query related to the feedback.
    - Rate the response.
    - Provide comments.
- **Refund Request Option:** Checkbox or separate form to request credit refunds.
- **Submit Button:** To send feedback or refund request.
- **Acknowledgment Message:** Confirmation of submission.

**Interconnections:**

- **AI Chat Interface:** Direct link after each response.
- **Dashboard:** Accessible via navigation.
- **Credit Adjustment:** Backend process to adjust credits after refund approval.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
    - **Form Handling:** Formik or React Hook Form
- **Backend:**
    - **API:** FastAPI endpoints to handle feedback submissions
- **Database:**
    - **Service:** Supabase (to store feedback data)
- **Credit Management:**
    - **Logic:** Backend logic to adjust credits based on feedback
- **Authentication:**
    - **Service:** Supabase Auth

---

## 12. Support/Contact Us Page

**Purpose:**

- Provide assistance to users.

**Content & Layout:**

- **Contact Form:** Fields for name, email, subject, and message.
- **Contact Information:** Email address, phone number (if applicable), and support hours.
- **FAQ Link:** Suggestion to check FAQs before submitting.

**Interconnections:**

- **FAQ/Help Page:** Via a link.
- **Dashboard:** Accessible via navigation.
- **Email System:** Sends the user's message to support staff.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Backend:**
    - **API:** FastAPI endpoint to receive support messages
- **Email Delivery:**
    - **Service:** Integration with an email service like SendGrid or Mailgun
- **Form Security:**
    - **Anti-Spam Measures:** Implement CAPTCHA (e.g., Google reCAPTCHA)

---

## 13. FAQ/Help Page

**Purpose:**

- Offer answers to common questions and guide users.

**Content & Layout:**

- **Categorized Questions:** Sections like:
    - Account Management
    - Using the AI Chat
    - Purchasing Credits
- **Search Functionality:** To find specific topics.
- **Detailed Answers:** Clear and concise explanations.
- **Visual Aids:** Screenshots or short videos if necessary.

**Interconnections:**

- **Support/Contact Us Page:** For unresolved issues.
- **Dashboard:** Accessible via navigation or footer.
- **Relevant Pages:** Links within answers to direct users.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Content Management:**
    - **Option 1:** Hardcoded FAQs in JSON or Markdown files
    - **Option 2 (Future):** Integrate a CMS like Contentful or Strapi
- **Search Functionality:**
    - Implement client-side search using JavaScript

---

## 14. Legal Pages (Terms of Service, Privacy Policy)

**Purpose:**

- Inform users about legal terms and data practices.

**Content & Layout:**

- **Textual Content:** Detailed legal language outlining terms and policies.
- **Navigation Links:** Table of contents for easy navigation within the document.

**Interconnections:**

- **Sign Up Page:** Users must agree to these terms.
- **Footer Links:** Accessible from all pages.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Content Management:**
    - Static content stored as Markdown files
    - Use a Markdown parser like `react-markdown` to render content

---

## 15. Error Pages (404, 500, etc.)

**Purpose:**

- Inform users of errors in a user-friendly manner.

**Content & Layout:**

- **Error Message:** Friendly text explaining the error.
- **Navigation Options:** Links to return to the Home Page or Dashboard.
- **Search Bar:** Optional, to help users find what they're looking for.

**Interconnections:**

- **Home/Landing Page:** Link to return home.
- **Dashboard:** If the user is logged in.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Routing:**
    - **Library:** React Router (to handle unmatched routes and display error pages)

---

## 16. Logout Functionality

**Purpose:**

- Allow users to securely log out.

**Content & Layout:**

- **Confirmation Prompt:** Optional, to confirm the user wants to log out.
- **Redirection:** After logging out, redirect to the Home/Landing Page.

**Interconnections:**

- **Available From:** Accessible via a dropdown under the user avatar or in the navigation menu.

**Tools & Technologies:**

- **Frontend:**
    - **Framework:** React.js
- **Authentication:**
    - **Service:** Supabase Auth (session termination)
    - **Library:** Supabase JavaScript Client

---

## Reasoning Behind the Structure

- **User-Centric Design:** Pages are designed to meet the specific needs and workflows of the user personas.
- **Intuitive Navigation:** Clear pathways between pages ensure users can move effortlessly through the application.
- **Focus on Core Features:** Emphasizing the AI Chat Interface and Document Repository aligns with the primary objectives.
- **Scalability:** The structure allows for future features like multi-language support without significant redesign.
- **Security and Compliance:** Incorporating authentication, legal pages, and secure payment processing meets non-functional requirements.