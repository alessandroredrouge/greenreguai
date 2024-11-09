import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div>
      <section className="bg-deep-blue text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">
              Simplify Renewable Energy Regulations Globally
            </h1>
            <p className="text-xl mb-8">
              Access and understand renewable energy laws and regulations worldwide with our AI-powered platform.
            </p>
            <Link
              to="/signup"
              className="bg-bright-lime text-deep-blue font-bold py-3 px-8 rounded-full inline-flex items-center hover:bg-opacity-90"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-3xl text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards go here */}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-3xl text-center mb-12">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial cards go here */}
          </div>
        </div>
      </section>
    </div>
  )
}