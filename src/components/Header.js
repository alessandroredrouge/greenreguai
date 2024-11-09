import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-forest-green text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="GreenReguAI Logo" className="h-8 w-auto mr-2" />
          <span className="font-montserrat font-bold text-xl">GreenReguAI</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-bright-lime">Home</Link>
          <Link to="/features" className="hover:text-bright-lime">Features</Link>
          <Link to="/about" className="hover:text-bright-lime">About Us</Link>
          <Link to="/contact" className="hover:text-bright-lime">Contact</Link>
          <Link to="/login" className="bg-bright-lime text-deep-blue px-4 py-2 rounded-full hover:bg-opacity-90">Login</Link>
        </nav>
        <div className="flex items-center md:hidden">
          <button aria-label="Search" className="mr-4">
            <Search className="h-6 w-6" />
          </button>
          <button aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}