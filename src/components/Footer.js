import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

export default function Footer() {
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
    <footer className="bg-eco-darker border-t border-eco-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-code font-bold text-eco-green text-lg mb-4">
              <span className="text-matrix-green">&gt;_</span>GreenReguAI
            </h3>
            <p className="text-eco-gray text-sm">Simplifying renewable energy regulations globally.</p>
          </div>
          <div>
            <h4 className="font-code text-eco-text font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('top')} 
                  className="text-eco-gray hover:text-eco-green transition-colors cursor-pointer"
                >
                  ~/home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="text-eco-gray hover:text-eco-green transition-colors cursor-pointer"
                >
                  ~/features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-eco-gray hover:text-eco-green transition-colors cursor-pointer"
                >
                  ~/pricing
                </button>
              </li>
              <li>
                <Link to="/about" className="text-eco-gray hover:text-eco-green transition-colors">
                  ~/about
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-eco-gray hover:text-eco-green transition-colors">
                  ~/contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-code text-eco-text font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-eco-gray hover:text-eco-green transition-colors">
                  ~/privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-eco-gray hover:text-eco-green transition-colors">
                  ~/terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-code text-eco-text font-semibold mb-4">Newsletter</h4>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="p-2 bg-eco-black border border-eco-dark rounded-lg text-eco-text placeholder-eco-gray focus:outline-none focus:ring-1 focus:ring-eco-green"
              />
              <button
                type="submit"
                className="bg-eco-green/10 text-eco-green px-4 py-2 rounded-lg border border-eco-green hover:bg-eco-green/20 transition-colors font-code"
              >
                subscribe()
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-eco-dark flex flex-col-reverse md:flex-row justify-between items-center">
          <div className="text-sm text-eco-gray mt-4 md:mt-0">
            <code className="font-code">© 2024 GreenReguAI. All rights reserved._</code>
          </div>
          <button
            onClick={() => scrollToSection('top')}
            className="font-code text-eco-green hover:text-eco-text transition-colors flex items-center gap-2 group"
          >
            <span>back_to_top()</span>
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}