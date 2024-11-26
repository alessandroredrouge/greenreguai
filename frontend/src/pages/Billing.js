import React, { useState } from 'react';
import { CreditCard, Check, Zap, Shield, Download, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Billing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState('basic');

  const plans = {
    monthly: [
      {
        name: 'Basic',
        id: 'basic',
        price: 49,
        credits: 1000,
        features: [
          'Basic AI Queries',
          'Standard Response Time',
          'Email Support',
          'Basic Analytics'
        ]
      },
      {
        name: 'Professional',
        id: 'pro',
        price: 99,
        credits: 3000,
        popular: true,
        features: [
          'Advanced AI Queries',
          'Priority Response Time',
          'Priority Support',
          'Advanced Analytics',
          'API Access'
        ]
      },
      {
        name: 'Enterprise',
        id: 'enterprise',
        price: 199,
        credits: 10000,
        features: [
          'Custom AI Model Training',
          'Instant Response Time',
          '24/7 Dedicated Support',
          'Custom Analytics',
          'Full API Access',
          'Custom Integration'
        ]
      }
    ],
    annual: [
      {
        name: 'Basic',
        id: 'basic',
        price: 470,
        credits: 12000,
        savings: 118
      },
      {
        name: 'Professional',
        id: 'pro',
        price: 950,
        credits: 36000,
        popular: true,
        savings: 238
      },
      {
        name: 'Enterprise',
        id: 'enterprise',
        price: 1990,
        credits: 120000,
        savings: 398
      }
    ]
  };

  return (
    <div className="min-h-screen bg-eco-black p-8">
      {/* Back Button */}
      <Link 
        to="/dashboard"
        className="inline-flex items-center gap-2 text-eco-green hover:text-eco-text transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-code">Back to Dashboard</span>
      </Link>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-code text-3xl text-eco-text mb-2">
            Billing <span className="text-eco-green">& Credits</span>
          </h1>
          <p className="text-eco-gray font-code">
            Manage your subscription and credit balance
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-eco-darker border border-eco-dark rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-code text-eco-gray mb-2">Current Plan</h3>
              <p className="text-2xl text-eco-text font-code">Professional</p>
            </div>
            <div>
              <h3 className="font-code text-eco-gray mb-2">Credits Available</h3>
              <p className="text-2xl text-eco-green font-code">2,459</p>
            </div>
            <div>
              <h3 className="font-code text-eco-gray mb-2">Next Billing Date</h3>
              <p className="text-2xl text-eco-text font-code">Apr 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-eco-darker border border-eco-dark rounded-full p-1 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-code transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-eco-green text-eco-black'
                  : 'text-eco-gray hover:text-eco-text'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-code transition-all ${
                billingCycle === 'annual'
                  ? 'bg-eco-green text-eco-black'
                  : 'text-eco-gray hover:text-eco-text'
              }`}
            >
              Annual (20% off)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans[billingCycle].map((plan) => (
            <div
              key={plan.id}
              className={`bg-eco-darker border rounded-lg transition-all ${
                plan.popular
                  ? 'border-eco-green shadow-lg shadow-eco-green/20 scale-105'
                  : 'border-eco-dark hover:border-eco-green'
              }`}
            >
              {plan.popular && (
                <div className="bg-eco-green/20 text-eco-green text-center py-2 rounded-t-lg font-code text-sm">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="font-code text-xl text-eco-text mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-code text-eco-text">${plan.price}</span>
                  <span className="text-eco-gray">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="mb-4 text-eco-green font-code text-sm">
                    Save ${plan.savings} per year
                  </div>
                )}
                <div className="mb-6">
                  <div className="font-code text-eco-gray mb-2">Credits Included</div>
                  <div className="text-xl text-eco-green font-code">
                    {plan.credits.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPlan(plan.id)}
                  className={`w-full py-2 px-4 rounded-lg font-code transition-all ${
                    currentPlan === plan.id
                      ? 'bg-eco-green text-eco-black'
                      : 'bg-eco-green/10 text-eco-green border border-eco-green hover:bg-eco-green/20'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
                <div className="mt-6 space-y-3">
                  {plan.features?.map((feature) => (
                    <div key={feature} className="flex items-center text-eco-gray">
                      <Check className="h-5 w-5 text-eco-green mr-2" />
                      <span className="font-code text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Credit Packages */}
        <div className="mb-12">
          <h2 className="font-code text-2xl text-eco-text mb-6">Additional Credits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { amount: 1000, price: 45, bonus: 0 },
              { amount: 5000, price: 200, bonus: 500 },
              { amount: 10000, price: 350, bonus: 1500 },
              { amount: 25000, price: 750, bonus: 5000 }
            ].map((package_) => (
              <div
                key={package_.amount}
                className="bg-eco-darker border border-eco-dark rounded-lg p-6 hover:border-eco-green transition-all"
              >
                <div className="font-code text-xl text-eco-text mb-2">
                  {package_.amount.toLocaleString()} Credits
                </div>
                {package_.bonus > 0 && (
                  <div className="text-eco-green font-code text-sm mb-2">
                    +{package_.bonus.toLocaleString()} Bonus
                  </div>
                )}
                <div className="text-2xl text-eco-text font-code mb-4">
                  ${package_.price}
                </div>
                <button className="w-full bg-eco-green/10 text-eco-green border border-eco-green rounded-lg py-2 font-code hover:bg-eco-green/20 transition-all">
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h2 className="font-code text-2xl text-eco-text mb-6">Billing History</h2>
          <div className="bg-eco-darker border border-eco-dark rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-eco-dark">
                <tr>
                  <th className="text-left p-4 font-code text-eco-gray">Date</th>
                  <th className="text-left p-4 font-code text-eco-gray">Description</th>
                  <th className="text-left p-4 font-code text-eco-gray">Amount</th>
                  <th className="text-left p-4 font-code text-eco-gray">Status</th>
                  <th className="text-left p-4 font-code text-eco-gray">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-eco-dark">
                  <td className="p-4 font-code text-eco-text">Mar 15, 2024</td>
                  <td className="p-4 font-code text-eco-text">Professional Plan - Monthly</td>
                  <td className="p-4 font-code text-eco-text">$99.00</td>
                  <td className="p-4">
                    <span className="bg-eco-green/20 text-eco-green px-2 py-1 rounded-full text-sm font-code">
                      Paid
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-eco-green hover:text-eco-text">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
