import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="bg-eco-black">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 bg-eco-green/10 px-3 py-1 rounded-full">
              <code className="text-eco-green font-code text-sm">
                $ ./initiate_sustainable_future.sh
              </code>
            </div>
            <h1 className="font-code font-bold text-4xl md:text-5xl mb-6 text-eco-text">
              <span className="text-matrix-green">&gt;_</span> Decode{" "}
              <span className="text-eco-green">Global Energy</span> Regulations
            </h1>
            <p className="font-code text-xl mb-8 text-eco-gray">
              AI-powered platform for navigating renewable energy regulations.
              <span className="text-eco-green">_</span>
            </p>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-eco-green/20 to-eco-blue/20 text-eco-green font-code py-3 px-8 rounded-lg inline-flex items-center hover:from-eco-green/30 hover:to-eco-blue/30 transition-all border border-eco-green group"
            >
              initialize_platform() 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}