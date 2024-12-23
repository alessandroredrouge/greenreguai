import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import { Link } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { sendChatMessage } from "../lib/api";
import { supabase } from '../lib/supabaseClient';

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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
    setMessages([]);
    setInput("");
  };

  const handleConversationSelect = async (conversation) => {
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

  return (
    <div className="flex h-screen bg-eco-black">
      {/* Sidebar */}
      <Sidebar 
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-eco-darker border-b border-eco-dark p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-eco-green hover:text-eco-text transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-code">Back to Dashboard</span>
            </Link>
            <span className="text-eco-text font-code border-l border-eco-dark pl-4">
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
                  className="hover:text-eco-green transition-colors"
                >
                  {selectedConversation?.title || 'New Conversation'}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eco-green font-code">
              {profile?.credits || 0} credits available
            </span>
            <UserMenu credits={profile?.credits || 0} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-eco-black relative">
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

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="absolute bottom-6 right-6 w-12 h-12 bg-eco-green/10 hover:bg-eco-green/20 
                       text-eco-green rounded-full shadow-lg flex items-center justify-center 
                       transition-all hover:scale-105 focus:outline-none focus:ring-2 
                       focus:ring-eco-green focus:ring-offset-2 focus:ring-offset-eco-black
                       border border-eco-green"
            aria-label="New Chat"
          >
            <Plus className="h-6 w-6" />
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
                <div className="font-code">{message.content}</div>
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

        {/* Input Area */}
        <div className="border-t border-eco-dark p-4 bg-eco-darker">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Click Enter to send)"
              className="w-full bg-eco-black text-eco-text border border-eco-dark rounded-lg py-3 px-4 pr-12 font-code focus:outline-none focus:border-eco-green"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-eco-green hover:text-eco-text transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
