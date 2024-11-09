import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, LinkedIn } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-deep-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">GreenReguAI</h3>
            <p className="text-sm">Simplifying renewable energy regulations globally.</p>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-bright-lime">Home</Link></li>
              <li><Link to="/features" className="hover:text-bright-lime">Features</Link></li>
              <li><Link to="/about" className="hover:text-bright-lime">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-bright-lime">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-bright-lime">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-bright-lime">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold mb-4">Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-bright-lime"
              />
              <button
                type="submit"
                className="bg-bright-lime text-deep-blue px-4 py-2 rounded-r-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bright-lime"
              >
                Subscribe
              </button>
            </form>
            {/* <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-bright-lime"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-bright-lime"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-bright-lime"><LinkedIn className="h-6 w-6" /></a>
            </div> */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          © 2023 GreenReguAI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}