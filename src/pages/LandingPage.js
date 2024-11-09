import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div>
      <section className="bg-cyber-darker py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-code font-bold text-4xl md:text-5xl mb-4">
              <span className="text-cyber-green">&gt;_</span> Decode Global Energy Regulations
            </h1>
            <p className="font-code text-xl mb-8 text-cyber-gray">
              AI-powered platform for navigating renewable energy regulations.
            </p>
            <Link
              to="/signup"
              className="bg-cyber-green/10 text-cyber-green font-code py-3 px-8 rounded-lg inline-flex items-center hover:bg-cyber-green/20 transition-colors border border-cyber-green"
            >
              initialize() <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}