import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-cyber-darker border-b border-cyber-dark">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <span className="font-code font-bold text-cyber-green text-xl">&gt;_GreenReguAI</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-code text-cyber-text hover:text-cyber-green transition-colors">/home</Link>
          <Link to="/features" className="font-code text-cyber-text hover:text-cyber-green transition-colors">/features</Link>
          <Link to="/about" className="font-code text-cyber-text hover:text-cyber-green transition-colors">/about</Link>
          <Link to="/contact" className="font-code text-cyber-text hover:text-cyber-green transition-colors">/contact</Link>
          <Link to="/login" className="font-code bg-cyber-green/10 text-cyber-green px-4 py-2 rounded hover:bg-cyber-green/20 transition-colors">
            login()
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