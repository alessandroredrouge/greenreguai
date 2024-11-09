import React, { useState } from 'react'
import { Send } from 'lucide-react'

export default function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', content: input }])
      // Here you would typically call your AI service
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'ai', content: 'This is a simulated AI response.' }])
      }, 1000)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-light-gray">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-forest-green text-white'
                  : 'bg-white text-deep-blue'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow mr-2 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-green"
          />
          <button
            onClick={handleSend}
            className="bg-forest-green text-white p-2 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}