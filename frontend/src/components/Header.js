import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  Home,
  X,
  Lightbulb,
  DollarSign,
  Info,
  MessageSquare,
  LogIn,
} from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-harvey-sidebar border-b border-gray-800 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img
            src="/GreenReguAI Logo Horizontal No Background with Writing.svg"
            alt="GreenReguAI"
            className="h-20 w-auto my-0"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => scrollToSection("top")}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center"
          >
            <Home className="w-4 h-4 mr-1" />
            ~/home
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            ~/features
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            ~/pricing
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center"
          >
            <Info className="w-4 h-4 mr-1" />
            ~/about
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            ~/contact
          </button>
          <Link
            to="/auth"
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded hover:bg-gray-700 transition-colors border border-gray-700 whitespace-nowrap inline-flex items-center"
          >
            <LogIn className="w-4 h-4 mr-1" />
            connect()
          </Link>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center md:hidden">
          <button
            aria-label="Search"
            className="text-gray-300 hover:text-white mr-4 transition-colors"
          >
            <Search className="h-6 w-6" />
          </button>
          <button
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-harvey-sidebar border-b border-gray-800 md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4">
              <button
                onClick={() => scrollToSection("top")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center w-full"
              >
                <Home className="w-4 h-4 mr-1" />
                ~/home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center w-full"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                ~/features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center w-full"
              >
                <DollarSign className="w-4 h-4 mr-1" />
                ~/pricing
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center w-full"
              >
                <Info className="w-4 h-4 mr-1" />
                ~/about
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center w-full"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                ~/contact
              </button>
              <Link
                to="/auth"
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded hover:bg-gray-700 transition-colors border border-gray-700 inline-flex items-center justify-center w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-1" />
                connect()
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
