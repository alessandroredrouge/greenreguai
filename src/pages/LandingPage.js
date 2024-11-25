import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Shield, Zap, Globe, CreditCard } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-eco-green" />,
      title: "AI-Powered Search",
      description: "Query complex regulations in natural language with our advanced AI assistant."
    },
    {
      icon: <Shield className="h-6 w-6 text-eco-green" />,
      title: "Verified Sources",
      description: "Access official documents with direct links to regulatory sources."
    },
    {
      icon: <Globe className="h-6 w-6 text-eco-green" />,
      title: "Global Coverage",
      description: "Comprehensive database of renewable energy regulations worldwide."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-eco-green" />,
      title: "Flexible Credits",
      description: "Start with 50 free credits and purchase more as needed."
    }
  ]

  const pricingPlans = [
    {
      name: "Starter Pack",
      credits: "100",
      price: "19",
      features: ["Basic & Advanced AI queries", "Document access", "Email support"]
    },
    {
      name: "Professional Pack",
      credits: "500",
      price: "79",
      features: ["Everything in Starter Pack", "Discounted Credits", "Priority support"]
    }
  ]

  return (
    <div className="bg-eco-black min-h-screen">
      {/* Hero Section */}
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
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-eco-green/20 to-eco-blue/20 text-eco-green font-code py-3 px-8 rounded-lg inline-flex items-center hover:from-eco-green/30 hover:to-eco-blue/30 transition-all border border-eco-green group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="text-eco-gray font-code py-3 px-8 rounded-lg inline-flex items-center hover:text-eco-text transition-all border border-eco-gray hover:border-eco-text"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-eco-darker">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-code text-3xl mb-12 text-eco-text">
            <span className="text-matrix-green">&gt;</span> Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-eco-dark rounded-lg bg-eco-black/50 hover:border-eco-green transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-code text-eco-text text-xl mb-2">{feature.title}</h3>
                <p className="text-eco-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-code text-3xl mb-12 text-eco-text">
            <span className="text-matrix-green">&gt;</span> Pricing Plans
          </h2>
          <p className="text-center font-code text-eco-gray mb-8">
            <span className="text-matrix-green">&gt;</span> Credit Usage:{" "}
            <span className="text-eco-green">1 credit</span> = Basic AI Query •{" "}
            <span className="text-eco-green">2 credits</span> = Advanced AI Query
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="p-6 border border-eco-dark rounded-lg bg-eco-darker hover:border-eco-green transition-colors">
                <h3 className="font-code text-eco-text text-2xl mb-2">{plan.name}</h3>
                <div className="text-eco-green text-4xl font-code mb-4">
                  ${plan.price}
                  <span className="text-eco-gray text-sm">/ {plan.credits} credits</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-eco-gray flex items-center">
                      <Zap className="h-4 w-4 text-eco-green mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="w-full bg-gradient-to-r from-eco-green/20 to-eco-blue/20 text-eco-green font-code py-2 px-4 rounded-lg inline-flex items-center justify-center hover:from-eco-green/30 hover:to-eco-blue/30 transition-all border border-eco-green"
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}