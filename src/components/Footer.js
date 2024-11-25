import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, LinkedIn } from 'lucide-react'

export default function Footer() {
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
            <h4 className="font-code text-eco-text font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-eco-gray hover:text-eco-green transition-colors">~/home</Link></li>
              <li><Link to="/features" className="text-eco-gray hover:text-eco-green transition-colors">~/features</Link></li>
              <li><Link to="/about" className="text-eco-gray hover:text-eco-green transition-colors">~/about</Link></li>
              <li><Link to="/contact" className="text-eco-gray hover:text-eco-green transition-colors">~/contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-code text-eco-text font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-eco-gray hover:text-eco-green transition-colors">~/privacy</Link></li>
              <li><Link to="/terms" className="text-eco-gray hover:text-eco-green transition-colors">~/terms</Link></li>
            </ul>
          </div>
          <div className="w-full">
            <h4 className="font-code text-eco-text font-semibold mb-4">Newsletter</h4>
            <form className="flex flex-col max-w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 p-2 bg-eco-black border border-eco-dark rounded-lg text-eco-text placeholder-eco-gray focus:outline-none focus:ring-1 focus:ring-eco-green"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-eco-green/10 text-eco-green px-4 py-2 rounded-lg border border-eco-green hover:bg-eco-green/20 transition-colors font-code"
                >
                  subscribe()
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-eco-dark text-center text-sm text-eco-gray">
          <code className="font-code">© 2024 GreenReguAI. All rights reserved._</code>
        </div>
      </div>
    </footer>
  )
}