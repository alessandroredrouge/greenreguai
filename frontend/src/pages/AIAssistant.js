import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import UserMenu from '../components/UserMenu';
import { Link } from 'react-router-dom';

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = {
        type: 'user',
        content: input,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Simulate AI response - replace with actual API call
      setTimeout(() => {
        const aiMessage = {
          type: 'ai',
          content: 'This is a simulated AI response about renewable energy regulations.',
          timestamp: new Date().toISOString(),
          sources: ['EU Directive 2018/2001', 'Regulation (EU) 2019/943']
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-eco-black">
      {/* Sidebar */}
      <Sidebar />

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
            <span className="text-eco-text font-code border-l border-eco-dark pl-4">Session: SESSION_123</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eco-green font-code">750 credits available</span>
            <UserMenu credits={750} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-eco-black relative">
          {/* Welcome Message */}
          <div className="flex items-start gap-2 text-eco-text">
            <Bot className="h-6 w-6 text-eco-green mt-1" />
            <div className="bg-eco-darker rounded-lg p-4 max-w-3xl">
              <div className="font-code">
                Welcome to GreenReguAI. How can I assist you with renewable energy regulations today?
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
            <div key={index} className={`flex items-start gap-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
              {message.type === 'ai' && <Bot className="h-6 w-6 text-eco-green mt-1" />}
              <div className={`rounded-lg p-4 max-w-3xl ${
                message.type === 'user' 
                  ? 'bg-eco-green text-eco-black' 
                  : 'bg-eco-darker text-eco-text'
              }`}>
                <div className="font-code">{message.content}</div>
                <div className="text-xs mt-2 opacity-70">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-eco-dark p-4 bg-eco-darker">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
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