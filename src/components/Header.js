import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-eco-darker border-b border-eco-dark">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/GreenReguAI Logo Horizontal No Background with Writing.svg" 
            alt="GreenReguAI" 
            className="h-20 w-auto my-0"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-code text-eco-text hover:text-eco-green transition-colors">~/home</Link>
          <Link to="/features" className="font-code text-eco-text hover:text-eco-green transition-colors">~/features</Link>
          <Link to="/about" className="font-code text-eco-text hover:text-eco-green transition-colors">~/about</Link>
          <Link to="/contact" className="font-code text-eco-text hover:text-eco-green transition-colors">~/contact</Link>
          <Link to="/login" className="font-code bg-eco-green/10 text-eco-green px-4 py-2 rounded hover:bg-eco-green/20 transition-colors border border-eco-green">
            connect()
          </Link>
        </nav>
        <div className="flex items-center md:hidden">
          <button aria-label="Search" className="text-cyber-text hover:text-cyber-green mr-4">
            <Search className="h-6 w-6" />
          </button>
          <button aria-label="Menu" className="text-cyber-text hover:text-cyber-green">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}