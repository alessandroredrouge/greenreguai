import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, Plus, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import { Link } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { sendChatMessage } from "../lib/api";
import { supabase } from "../lib/supabaseClient";
import CitationHighlight from "../components/CitationHighlight";
import CitationPreviewModal from "../components/CitationPreviewModal";
import PDFPreviewModal from "../components/PDFPreviewModal";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile, refreshProfile } = useUserProfile();
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfInfo, setSelectedPdfInfo] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      try {
        setIsTyping(true);

        // Add user message immediately
        const userMessage = {
          type: "user",
          content: input,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Send to backend
        const response = await sendChatMessage(
          input,
          currentConversationId,
          user.email
        );

        // Add AI response
        const aiMessage = {
          type: "ai",
          content: response.response,
          timestamp: new Date().toISOString(),
          sources: response.sources,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Update conversation ID if new
        setCurrentConversationId(response.conversation_id);

        // Force refresh message data by fetching from Supabase
        if (response.conversation_id) {
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", response.conversation_id)
            .order("message_index", { ascending: true });

          if (messages) {
            setMessages(
              messages.map((msg) => ({
                type: msg.role === "user" ? "user" : "ai",
                content: msg.content,
                timestamp: msg.created_at,
                sources: msg.sources,
              }))
            );
          }
        }

        // Refresh profile to update credits
        await refreshProfile();
      } catch (error) {
        console.error("Chat error:", error);
        // Add error message to chat
        const errorMessage = {
          type: "error",
          content:
            error.response?.data?.detail ||
            "An error occurred while processing your request.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    // Clear current conversation state
    setCurrentConversationId(null);
    setSelectedConversation(null);
    setNewTitle("New Conversation");
    setMessages([]);
    setInput("");

    // Scroll to top of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationSelect = async (conversation) => {
    if (!conversation) {
      // Reset everything to initial state
      setSelectedConversation(null);
      setCurrentConversationId(null);
      setNewTitle("New Conversation");
      setMessages([]);
      return;
    }

    setSelectedConversation(conversation);
    setCurrentConversationId(conversation.conversation_id);
    setNewTitle(conversation.title);

    // Fetch conversation messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.conversation_id)
      .order("message_index", { ascending: true });

    if (messages) {
      setMessages(
        messages.map((msg) => ({
          type: msg.role === "user" ? "user" : "ai",
          content: msg.content,
          timestamp: msg.created_at,
          sources: msg.sources,
        }))
      );
    }
  };

  const handleTitleEdit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentConversationId && newTitle.trim()) {
        try {
          const { error } = await supabase
            .from("conversations")
            .update({ title: newTitle.trim() })
            .eq("conversation_id", currentConversationId);

          if (!error) {
            setSelectedConversation((prev) => ({
              ...prev,
              title: newTitle.trim(),
            }));
            setIsEditingTitle(false);
          }
        } catch (error) {
          console.error("Error updating title:", error);
        }
      }
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setNewTitle(selectedConversation?.title || "New Conversation");
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // FIXME: enhance error handling, cause sometimes bad looking error messages are shown to the user
  const handleCitationClick = async (citationIndices) => {
    // Get the current message's sources
    const currentMessage = messages[messages.length - 1];
    if (!currentMessage?.sources) return;

    try {
      // Get unique document IDs from the citations
      const documentIds = [
        ...new Set(
          citationIndices.map(
            (index) => currentMessage.sources[index].document_id
          )
        ),
      ];

      // Fetch document titles from Supabase
      // FIXME: the retrieval of title and publication_year through the document_id is a very inefficient approach that slows down significanlty the webapp> Consider saving these values directly in the chunks table to avoid this issue.
      const { data: documents, error } = await supabase
        .from("documents")
        .select("document_id, title, publication_year")
        .in("document_id", documentIds);

      if (error) throw error;

      // Create a map of document_id to title for easy lookup
      const documentInfo = Object.fromEntries(
        documents.map((doc) => [
          doc.document_id,
          {
            title: doc.title,
            publication_year: doc.publication_year,
          },
        ])
      );

      // Prepare citation data for the modal
      const citationData = citationIndices.map((index) => {
        const source = currentMessage.sources[index];
        const docInfo = documentInfo[source.document_id] || {
          title: "Unknown Document",
          publication_year: "N/A",
        };

        return {
          index,
          content: source.content,
          document_title: docInfo.title,
          publication_year: docInfo.publication_year,
          page_number: source.page_number,
          location_data: source.location_data,
          chunk_id: source.chunk_id,
          document_id: source.document_id,
        };
      });

      setSelectedCitations(citationData);
      setShowCitationModal(true);
    } catch (error) {
      console.error("Error fetching document titles:", error);
      // Fallback to showing document IDs if fetch fails
      const citationData = citationIndices.map((index) => {
        const source = currentMessage.sources[index];
        return {
          index,
          content: source.content,
          document_title: `Document ${source.document_id}`,
          page_number: source.page_number,
          location_data: source.location_data,
          chunk_id: source.chunk_id,
          document_id: source.document_id,
        };
      });

      setSelectedCitations(citationData);
      setShowCitationModal(true);
    }
  };

  const handleViewSource = async (citation) => {
    console.log("Citation data:", citation);
    try {
      // Get document info and signed URL
      const { data: document, error } = await supabase
        .from("documents")
        .select("title, file_path")
        .eq("document_id", citation.document_id)
        .single();

      if (error) throw error;

      // Get signed URL for the PDF
      const {
        data: { signedUrl },
        error: urlError,
      } = await supabase.storage
        .from("official_documents")
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry

      if (urlError) throw urlError;

      setSelectedPdfInfo({
        url: signedUrl,
        pageNumber: citation.page_number,
        locationData: citation.location_data,
        title: document.title,
      });

      console.log("Selected PDF info:", selectedPdfInfo);

      setShowCitationModal(false);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error loading PDF:", error);
      // You might want to show an error message to the user
    }
  };
  // FIXME: error handling message currently not used
  const showTemporaryAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide after 5 seconds
  };

  const handleSendMessage = async (message) => {
    try {
      const response = await sendChatMessage(
        message,
        currentConversationId,
        user.email
      );
      // Handle successful response
    } catch (error) {
      if (error.message.includes("Rate limit")) {
        // Show user-friendly message
        setError(
          "You've sent too many messages. Please wait a moment before sending more."
        );
        // Optional: Disable send button for a short period
        setSendDisabled(true);
        setTimeout(() => setSendDisabled(false), 5000);
      } else {
        setError("An error occurred while sending your message.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-harvey-bg relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Modified for responsive */}
      <div
        className={`
        fixed lg:relative
        ${
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        transition-transform duration-200 ease-in-out
        z-30 lg:z-auto
        h-full
      `}
      >
        <Sidebar
          currentConversationId={currentConversationId}
          onConversationSelect={(conv) => {
            handleConversationSelect(conv);
            setIsMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Chat Area - Modified for mobile fixed header/footer */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header - Added fixed positioning for mobile */}
        <div className="bg-harvey-bg border-b border-harvey-border p-4 fixed top-0 left-0 right-0 lg:relative lg:top-auto lg:left-auto lg:right-auto z-10">
          {/* Top row with menu, back button, and user menu */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileSidebar}
                className="lg:hidden text-harvey-text hover:text-harvey-text-light transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-harvey-text-light hover:text-harvey-text transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </div>

            {/* Desktop credits and user menu */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-harvey-text-light">
                {profile?.credits || 0} credits available
              </span>
              <UserMenu credits={profile?.credits || 0} />
            </div>

            {/* Mobile user menu */}
            <div className="lg:hidden">
              <UserMenu credits={profile?.credits || 0} />
            </div>
          </div>

          {/* Title */}
          <div className="mt-4">
            {isEditingTitle ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleTitleEdit}
                onBlur={() => setIsEditingTitle(false)}
                className="bg-harvey-bg-lighter text-harvey-text border border-harvey-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-harvey-text text-xl font-medium hover:text-harvey-text-light transition-colors truncate block w-full text-left"
              >
                {selectedConversation?.title || "New Conversation"}
              </button>
            )}
          </div>

          {/* Mobile credits display */}
          <div className="text-harvey-text-light text-sm mt-1 lg:hidden">
            {profile?.credits || 0} credits available
          </div>
        </div>

        {/* Messages Area - Modified to account for fixed header and footer on mobile */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-harvey-bg relative mt-[132px] lg:mt-0 mb-[76px] lg:mb-0">
          {/* Welcome Message */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="4" fill="#F2F2F2" />
                <path
                  d="M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"
                  fill="#D9D9D9"
                />
              </svg>
            </div>
            <div className="bg-harvey-bg-darker rounded-lg p-4 max-w-3xl">
              <div>
                Welcome to GreenReguAI. How can I assist you with renewable
                energy regulations today?
              </div>
              <div className="text-xs text-harvey-text-light mt-2">
                {new Date("2024-03-15T14:30:00").toLocaleString()}
              </div>
            </div>
          </div>

          {/* New Chat Button - Modified for responsive */}
          <button
            onClick={handleNewChat}
            className="fixed bottom-20 right-4 w-10 h-10 lg:w-12 lg:h-12 bg-harvey-bg-lighter hover:bg-harvey-hover 
                     text-harvey-text rounded-full shadow-md flex items-center justify-center 
                     transition-all hover:scale-105 focus:outline-none focus:ring-2 
                     focus:ring-gray-300 z-10 border border-harvey-border"
            aria-label="New Chat"
          >
            <Plus className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Chat Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 mb-6 ${
                message.type === "user" ? "justify-end" : ""
              }`}
            >
              {message.type === "ai" && (
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="4" fill="#F2F2F2" />
                    <path
                      d="M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"
                      fill="#D9D9D9"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`rounded-lg p-4 max-w-3xl ${
                  message.type === "user"
                    ? "bg-gray-800 text-white"
                    : message.type === "error"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-harvey-bg-darker text-harvey-text"
                }`}
              >
                <div>
                  {message.type === "ai" ? (
                    <CitationHighlight
                      text={message.content}
                      onCitationClick={handleCitationClick}
                    />
                  ) : (
                    message.content
                  )}
                </div>
                <div className="text-xs mt-2 text-harvey-text-light">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Loading Indicator */}
          {isTyping && (
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#F2F2F2" />
                  <path
                    d="M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
              <div className="bg-harvey-bg-darker rounded-lg p-4">
                <div>Thinking...</div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Added fixed positioning for mobile */}
        <div className="border-t border-harvey-border p-3 sm:p-4 bg-harvey-bg fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
          <div className="relative max-w-[1200px] mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-harvey-bg-lighter text-harvey-text border border-harvey-border rounded-lg 
                       py-3 px-4 pr-12
                       focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <button
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-harvey-text-light 
                       hover:text-harvey-text transition-colors p-2"
              disabled={sendDisabled}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <CitationPreviewModal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        citations={selectedCitations}
        onViewSource={handleViewSource}
      />

      <PDFPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        pdfUrl={selectedPdfInfo?.url}
        pageNumber={selectedPdfInfo?.pageNumber}
        locationData={selectedPdfInfo?.locationData}
        documentTitle={selectedPdfInfo?.title}
      />

      {showAlert && (
        <div
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 
                        bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-lg 
                        border border-red-200 text-sm max-w-md text-center"
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}
