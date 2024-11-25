import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Shield, Zap, Globe, CreditCard, RefreshCw } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-eco-green" />,
      title: "AI-Powered Search",
      description: "Query complex regulations in natural language with our advanced AI assistant."
    },
    {
      icon: <Shield className="h-6 w-6 text-eco-green" />,
      title: "Verify Sources In A Click",
      description: "Instantly verify AI responses by accessing source documents with direct links to relevant regulatory sections."
    },
    {
      icon: <Globe className="h-6 w-6 text-eco-green" />,
      title: "Wide Coverage",
      description: "Comprehensive database of renewable energy regulations, starting with EU coverage and expanding worldwide."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-eco-green" />,
      title: "Pay As You Go",
      description: "Start with 50 free credits and purchase more as needed. No annoying subscription fees for things you don't need."
    }
  ]

  const pricingPlans = [
    {
      name: "Starter Pack",
      credits: "100",
      price: "19",
      pricePerCredit: "0.19",
      features: ["Basic & Advanced AI queries", "Access to all the official documents", "Email support"]
    },
    {
      name: "Professional Pack", 
      credits: "500",
      price: "79",
      pricePerCredit: "0.158", // 20% discount per credit
      features: ["Everything in Starter Pack", "20% discount on credit price", "Priority support"]
    }
  ]

  // Add state for price display mode for each plan
  const [priceDisplayModes, setPriceDisplayModes] = useState({
    "Starter Pack": 'bundle',
    "Professional Pack": 'bundle'
  });

  const [showTooltip, setShowTooltip] = useState({});

  const togglePriceMode = (planName) => {
    setPriceDisplayModes(prev => ({
      ...prev,
      [planName]: prev[planName] === 'bundle' ? 'per-credit' : 'bundle'
    }));
  };

  return (
    <div className="bg-eco-black min-h-screen pt-32">
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
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="bg-eco-green/10 text-eco-green font-code py-3 px-8 rounded-lg inline-flex items-center hover:bg-eco-green/20 transition-all border border-eco-green group min-w-[200px]"
              >
                <span className="mx-auto flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Link>
              <Link
                to="/login"
                className="bg-eco-green/10 text-eco-green font-code py-3 px-8 rounded-lg inline-flex items-center hover:bg-eco-green/20 transition-all border border-eco-green group min-w-[200px]"
              >
                <span className="mx-auto flex items-center">
                  User Login
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-eco-darker scroll-mt-32">
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
      <section id="pricing" className="py-20 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-code text-3xl mb-12 text-eco-text">
            <span className="text-matrix-green">&gt;</span> Pricing Packs
          </h2>
          <div className="text-center mb-12">
            <p className="font-code text-2xl text-eco-text">
              <span className="text-matrix-green">&gt;</span>{" "}
              <span className="text-eco-green font-bold">50 FREE CREDITS</span> for your first try, and then
            </p>
            <div className="text-eco-green text-4xl mt-2 animate-bounce">↓</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="relative p-6 border border-eco-dark rounded-lg bg-eco-darker hover:border-eco-green transition-colors">
                {/* Toggle Button with Tooltip */}
                <div className="absolute top-4 right-4 group">
                  <button
                    onClick={() => togglePriceMode(plan.name)}
                    onMouseEnter={() => setShowTooltip({...showTooltip, [plan.name]: true})}
                    onMouseLeave={() => setShowTooltip({...showTooltip, [plan.name]: false})}
                    className="text-eco-green hover:text-eco-text transition-colors p-1 border border-eco-green/0 hover:border-eco-green/50 rounded-lg group-hover:bg-eco-green/5 flex items-center gap-1"
                  >
                    <span className="text-base font-code font-bold text-[1.25rem]">$</span>
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  
                  {/* Tooltip */}
                  <div className={`absolute right-0 mt-2 w-48 bg-eco-darker border border-eco-green p-2 rounded-lg text-eco-gray text-xs font-code ${showTooltip[plan.name] ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 pointer-events-none z-10`}>
                    Click to switch to {priceDisplayModes[plan.name] === 'bundle' ? 'price per credit' : 'bundle price'}
                  </div>
                </div>
                
                {/* Price Display with Label */}
                <h3 className="font-code text-eco-text text-2xl mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <div className="text-eco-green text-4xl font-code">
                    ${priceDisplayModes[plan.name] === 'bundle' ? plan.price : plan.pricePerCredit}
                  </div>
                  <div className="text-eco-gray text-sm font-code mt-1">
                    {priceDisplayModes[plan.name] === 'bundle' 
                      ? `Bundle price for ${plan.credits} credits` 
                      : 'Price per individual credit'}
                  </div>
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
                  className="w-full bg-eco-green/10 text-eco-green font-code py-2 px-4 rounded-lg inline-flex items-center justify-center hover:bg-eco-green/20 transition-all border border-eco-green"
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center font-code text-eco-gray mb-8 mt-12">
            <span className="text-matrix-green">&gt;</span> Credit Usage:{" "}
            <span className="text-eco-green">1 credit</span> = 1 Basic AI Query •{" "}
            <span className="text-eco-green">2 credits</span> = 1 Advanced AI Query (soon available)
          </p>
        </div>
      </section>
    </div>
  )
}