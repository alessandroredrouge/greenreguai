// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Search, 
  Clock, 
  PieChart, 
  MessageSquare,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  // Placeholder data - will be replaced with real user data
  const userData = {
    name: "User",
    credits: 750,
    queriesRemaining: 500,
    recentQueries: [
      { type: "Regulation Search", credits: 5, status: "success" },
      { type: "Policy Analysis", credits: 10, status: "success" },
      { type: "Compliance Check", credits: 8, status: "error" }
    ],
    creditUsage: {
      used: 250,
      remaining: 500
    },
    feedback: {
      accuracy: "98%",
      rating: "4.9",
      avgTime: "1.2s"
    }
  };

  return (
    <div className="min-h-screen bg-eco-black p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-code text-eco-text text-2xl mb-2">
              Welcome back, <span className="text-eco-green">{userData.name}</span>
            </h1>
            <p className="font-code text-eco-gray">
              &gt; Ready for your next query
            </p>
          </div>
          <div className="text-right">
            <div className="font-code text-eco-green text-3xl">{userData.credits}</div>
            <div className="text-eco-gray text-sm">{userData.queriesRemaining} queries remaining</div>
          </div>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* New AI Query Card */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex justify-center mb-4">
            <Bot className="h-12 w-12 text-eco-green" />
          </div>
          <h2 className="font-code text-xl text-center text-eco-text mb-3">
            New AI Query
          </h2>
          <p className="text-eco-gray text-center mb-6">
            Get instant AI-powered analysis of renewable energy regulations
          </p>
          <Link 
            to="/ai-assistant"
            className="block text-center bg-eco-green/10 text-eco-green font-code py-3 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green group"
          >
            Start New Query <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search Regulations Card */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-eco-green" />
          </div>
          <h2 className="font-code text-xl text-center text-eco-text mb-3">
            Search Regulations
          </h2>
          <p className="text-eco-gray text-center mb-6">
            Browse and search through our comprehensive regulation database
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search regulations..."
              className="w-full bg-eco-black border border-eco-dark rounded-lg py-3 px-4 text-eco-text placeholder-eco-gray focus:outline-none focus:border-eco-green"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Recent Queries */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-eco-green" />
            <h3 className="font-code text-eco-text">Recent Queries</h3>
          </div>
          <div className="space-y-3">
            {userData.recentQueries.map((query, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-eco-gray">{query.type}</span>
                <span className={`font-code ${query.status === 'error' ? 'text-red-500' : 'text-eco-green'}`}>
                  {query.credits} credits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Usage */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-eco-green" />
            <h3 className="font-code text-eco-text">Credit Usage</h3>
          </div>
          <div className="mb-2">
            <div className="h-2 bg-eco-black rounded-full">
              <div 
                className="h-full bg-eco-green rounded-full"
                style={{ width: `${(userData.creditUsage.used / (userData.creditUsage.used + userData.creditUsage.remaining)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-eco-gray">{userData.creditUsage.used} used</span>
            <span className="text-eco-gray">{userData.creditUsage.remaining} remaining</span>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-eco-green" />
            <h3 className="font-code text-eco-text">Feedback</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-eco-green text-xl font-code">{userData.feedback.accuracy}</div>
              <div className="text-eco-gray text-sm">Accuracy</div>
            </div>
            <div>
              <div className="text-eco-green text-xl font-code">{userData.feedback.rating}</div>
              <div className="text-eco-gray text-sm">Rating</div>
            </div>
            <div>
              <div className="text-eco-green text-xl font-code">{userData.feedback.avgTime}</div>
              <div className="text-eco-gray text-sm">Avg. Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Credits */}
      <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-eco-green" />
          <h3 className="font-code text-eco-text">Purchase Credits</h3>
        </div>
        <Link 
          to="/billing"
          className="inline-block bg-eco-green/10 text-eco-green font-code py-2 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green group"
        >
          View Plans <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
