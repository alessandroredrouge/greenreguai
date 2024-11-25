import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, Home } from 'lucide-react'

export default function Header() {
  const scrollToSection = (sectionId) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-eco-darker border-b border-eco-dark fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/GreenReguAI Logo Horizontal No Background with Writing.svg" 
            alt="GreenReguAI" 
            className="h-20 w-auto my-0"
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('top')} 
            className="font-code text-eco-text hover:text-eco-green transition-colors cursor-pointer inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-1" />~/home
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="font-code text-eco-text hover:text-eco-green transition-colors cursor-pointer"
          >
            ~/features
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="font-code text-eco-text hover:text-eco-green transition-colors cursor-pointer"
          >
            ~/pricing
          </button>
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