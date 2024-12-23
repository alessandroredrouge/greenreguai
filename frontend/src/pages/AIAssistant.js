import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, Plus, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import { Link } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { sendChatMessage } from "../lib/api";
import { supabase } from '../lib/supabaseClient';
import CitationHighlight from "../components/CitationHighlight";
import CitationPreviewModal from "../components/CitationPreviewModal";

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
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.conversation_id)
      .order('message_index', { ascending: true });
      
    if (messages) {
      setMessages(messages.map(msg => ({
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: msg.created_at,
        sources: msg.sources
      })));
    }
  };

  const handleTitleEdit = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentConversationId && newTitle.trim()) {
        try {
          const { error } = await supabase
            .from('conversations')
            .update({ title: newTitle.trim() })
            .eq('conversation_id', currentConversationId);
            
          if (!error) {
            setSelectedConversation(prev => ({...prev, title: newTitle.trim()}));
            setIsEditingTitle(false);
          }
        } catch (error) {
          console.error('Error updating title:', error);
        }
      }
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setNewTitle(selectedConversation?.title || 'New Conversation');
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleCitationClick = (citationIndices) => {
    // Get the current message's sources
    const currentMessage = messages[messages.length - 1];
    if (!currentMessage?.sources) return;

    // Prepare citation data for the modal
    const citationData = citationIndices.map(index => {
      const source = currentMessage.sources[index];
      return {
        index,
        content: source.content,
        document_title: source.document_id, // We'll need to fetch the actual title
        page_number: source.page_number,
        location_data: source.location_data,
        chunk_id: source.chunk_id,
        document_id: source.document_id
      };
    });

    setSelectedCitations(citationData);
    setShowCitationModal(true);
  };

  const handleViewSource = (citation) => {
    console.log("View source for citation:", citation); // For testing
    setShowCitationModal(false);
    // We'll implement PDF preview in the next step
  };

  return (
    <div className="flex h-screen bg-eco-black relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Modified for responsive */}
      <div className={`
        fixed lg:relative
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-200 ease-in-out
        z-30 lg:z-auto
        h-full
      `}>
        <Sidebar 
          currentConversationId={currentConversationId}
          onConversationSelect={(conv) => {
            handleConversationSelect(conv);
            setIsMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Chat Area - Modified for responsive */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header - Modified for responsive */}
        <div className="bg-eco-darker border-b border-eco-dark p-4">
          {/* Top row with menu, back button, and user menu */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileSidebar}
                className="lg:hidden text-eco-green hover:text-eco-text transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-eco-green hover:text-eco-text transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-code">Back to Dashboard</span>
              </Link>
            </div>

            {/* Desktop credits and user menu */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-eco-green font-code">
                {profile?.credits || 0} credits available
              </span>
              <UserMenu credits={profile?.credits || 0} />
            </div>

            {/* Mobile user menu */}
            <div className="lg:hidden">
              <UserMenu credits={profile?.credits || 0} />
            </div>
          </div>

          {/* Bottom row with title and mobile credits */}
          <div className="flex flex-col lg:hidden">
            {/* Title */}
            <div className="text-eco-text font-code">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleTitleEdit}
                  onBlur={() => setIsEditingTitle(false)}
                  className="bg-eco-black text-eco-text border border-eco-dark rounded px-2 py-1 font-code focus:outline-none focus:border-eco-green w-full"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="hover:text-eco-green transition-colors truncate block w-full text-left"
                >
                  {selectedConversation?.title || 'New Conversation'}
                </button>
              )}
            </div>
            
            {/* Mobile credits display */}
            <div className="text-eco-green font-code text-sm mt-1">
              {profile?.credits || 0} credits available
            </div>
          </div>

          {/* Desktop title - hidden on mobile */}
          <div className="hidden lg:block text-eco-text font-code border-l border-eco-dark pl-4">
            {isEditingTitle ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleTitleEdit}
                onBlur={() => setIsEditingTitle(false)}
                className="bg-eco-black text-eco-text border border-eco-dark rounded px-2 py-1 font-code focus:outline-none focus:border-eco-green"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="hover:text-eco-green transition-colors truncate max-w-[200px] block"
              >
                {selectedConversation?.title || 'New Conversation'}
              </button>
            )}
          </div>
        </div>

        {/* Messages Area - Modified for responsive */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-eco-black relative">
          {/* Welcome Message */}
          <div className="flex items-start gap-2 text-eco-text">
            <Bot className="h-6 w-6 text-eco-green mt-1" />
            <div className="bg-eco-darker rounded-lg p-4 max-w-3xl">
              <div className="font-code">
                Welcome to GreenReguAI. How can I assist you with renewable
                energy regulations today?
              </div>
              <div className="text-xs text-eco-gray mt-2">
                2024-03-15 14:30:00
              </div>
            </div>
          </div>

          {/* New Chat Button - Modified for responsive */}
          <button
            onClick={handleNewChat}
            className="fixed bottom-20 right-4 w-10 h-10 lg:w-12 lg:h-12 bg-eco-green/10 hover:bg-eco-green/20 
                     text-eco-green rounded-full shadow-lg flex items-center justify-center 
                     transition-all hover:scale-105 focus:outline-none focus:ring-2 
                     focus:ring-eco-green focus:ring-offset-2 focus:ring-offset-eco-black
                     border border-eco-green z-10"
            aria-label="New Chat"
          >
            <Plus className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Chat Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                message.type === "user" ? "justify-end" : ""
              }`}
            >
              {message.type === "ai" && (
                <Bot className="h-6 w-6 text-eco-green mt-1" />
              )}
              <div
                className={`rounded-lg p-4 max-w-3xl ${
                  message.type === "user"
                    ? "bg-eco-green text-eco-black"
                    : message.type === "error"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-eco-darker text-eco-text"
                }`}
              >
                <div className="font-code">
                  {message.type === "ai" ? (
                    <CitationHighlight 
                      text={message.content} 
                      onCitationClick={handleCitationClick} 
                    />
                  ) : (
                    message.content
                  )}
                </div>
                <div className="text-xs mt-2 opacity-70">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Loading Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <Bot className="h-6 w-6 text-eco-green mt-1" />
              <div className="bg-eco-darker rounded-lg p-4">
                <div className="font-code">Thinking...</div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Modified for responsive */}
        <div className="border-t border-eco-dark p-2 sm:p-4 bg-eco-darker">
          <div className="relative max-w-[1200px] mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-eco-black text-eco-text border border-eco-dark rounded-lg 
                       py-2 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 font-code text-sm sm:text-base
                       focus:outline-none focus:border-eco-green"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-eco-green 
                       hover:text-eco-text transition-colors p-1 sm:p-2"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
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
    </div>
  );
}
