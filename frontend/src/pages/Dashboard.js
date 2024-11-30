// src/pages/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../contexts/AuthContext";
import {
  Bot,
  Search,
  Clock,
  PieChart,
  MessageSquare,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
  Circle,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, creditInfo } = useUserProfile();

  // Placeholder data - will be replaced with real user data
  const userData = {
    name: "User",
    credits: 750,
    queriesRemaining: 500,
    recentQueries: [
      {
        type: "Regulation Search",
        credits: 5,
        status: "success",
        timestamp: "2024-03-15 14:30",
      },
      {
        type: "Policy Analysis",
        credits: 10,
        status: "success",
        timestamp: "2024-03-15 13:15",
      },
      {
        type: "Compliance Check",
        credits: 8,
        status: "error",
        timestamp: "2024-03-15 11:45",
      },
      {
        type: "Market Research",
        credits: 15,
        status: "success",
        timestamp: "2024-03-15 10:30",
      },
      {
        type: "Risk Assessment",
        credits: 12,
        status: "success",
        timestamp: "2024-03-15 09:15",
      },
    ],
    creditUsage: {
      used: 250,
      remaining: 500,
    },
    feedback: {
      accuracy: "98%",
      rating: "4.9",
      avgTime: "1.2s",
    },
    notifications: [
      {
        type: "info",
        message:
          "I'll build this component if someone buys some credits, pliz :_)",
        timestamp: "2024-03-15 09:00",
        read: false,
      },
      {
        type: "warning",
        message: "This notification is scaaary, wuhuuuu.",
        timestamp: "2024-03-14 15:30",
        read: true,
      },
      {
        type: "success",
        message: "Placeholder for a random notification.",
        timestamp: "2024-03-13 11:20",
        read: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-eco-black p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-code text-eco-text text-2xl mb-2">
              Welcome back,{" "}
              <span className="text-eco-green">
                {profile?.email || user?.email || "User"}
              </span>
            </h1>
            <p className="font-code text-eco-gray">
              &gt; Ready for your next query? :)
            </p>
          </div>
          <UserMenu credits={profile?.credits || 0} />
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
            Ask the AI Assistant
          </h2>
          <p className="text-eco-gray text-center mb-6">
            Get instant AI-powered analysis of renewable energy regulations
          </p>
          <Link
            to="/ai-assistant"
            className="block text-center bg-eco-green/10 text-eco-green font-code py-3 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green group"
          >
            Start New Query{" "}
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search Regulations Card */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-eco-green" />
          </div>
          <h2 className="font-code text-xl text-center text-eco-text mb-3">
            Consult the Document Library
          </h2>
          <p className="text-eco-gray text-center mb-6">
            Browse and search through our comprehensive regulation database
          </p>
          <Link
            to="/document-library"
            className="block text-center bg-eco-green/10 text-eco-green font-code py-3 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green group"
          >
            Search Official Documents{" "}
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Credit Usage */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <h2 className="font-code text-xl text-eco-text flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-eco-green" />
            Credit Usage
          </h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-eco-gray mb-2">
              <span>{creditInfo?.total_used || 0} used</span>
              <span>
                {(creditInfo?.total_purchased || 0) -
                  (creditInfo?.total_used || 0)}{" "}
                remaining
              </span>
            </div>
            <div className="h-2 bg-eco-dark rounded-full">
              <div
                className="h-full bg-eco-green rounded-full"
                style={{
                  width: `${
                    creditInfo?.total_purchased
                      ? (creditInfo.total_used / creditInfo.total_purchased) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <Link
            to="/billing"
            className="block text-center bg-eco-green/10 text-eco-green font-code py-2 px-4 
                       rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green 
                       group"
          >
            Purchase Credits
            <ArrowRight className="inline ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Notification Center */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-eco-green" />
              <h3 className="font-code text-eco-text">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-eco-green bg-eco-green/10 px-2 py-1 rounded-full font-code">
                {userData.notifications.filter((n) => !n.read).length} new
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[160px] overflow-y-auto">
            {userData.notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  notification.read
                    ? "border-eco-dark/50 bg-eco-dark/10"
                    : "border-eco-green/50 bg-eco-green/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  {notification.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-1" />
                  )}
                  {notification.type === "info" && (
                    <Info className="h-4 w-4 text-eco-green flex-shrink-0 mt-1" />
                  )}
                  {notification.type === "success" && (
                    <CheckCircle className="h-4 w-4 text-eco-green flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-eco-text font-code">
                      {notification.message}
                    </p>
                    <p className="text-xs text-eco-gray mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5 text-eco-green" />
            <h3 className="font-code text-eco-text">Connect & Rate</h3>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <a
              href="https://x.com/aleredrouge"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-eco-dark rounded-lg bg-eco-black/50 hover:border-eco-green transition-colors group flex flex-col items-center"
            >
              <div className="text-eco-green text-xl mb-1">𝕏</div>
              <div className="text-eco-gray group-hover:text-eco-green transition-colors text-xs">
                Follow
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/alessandro-rossi1/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-eco-dark rounded-lg bg-eco-black/50 hover:border-eco-green transition-colors group flex flex-col items-center"
            >
              <div className="text-eco-green text-xl mb-1">in</div>
              <div className="text-eco-gray group-hover:text-eco-green transition-colors text-xs">
                Connect
              </div>
            </a>

            <a
              href="mailto:SixCleantechAIStartupsinSixMonths@outlook.com"
              className="p-2 border border-eco-dark rounded-lg bg-eco-black/50 hover:border-eco-green transition-colors group flex flex-col items-center"
            >
              <div className="text-eco-green text-xl mb-1">@</div>
              <div className="text-eco-gray group-hover:text-eco-green transition-colors text-xs">
                Email
              </div>
            </a>
          </div>

          {/* Product Hunt Rating */}
          <a
            href="https://www.producthunt.com/posts/your-product"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-eco-green/10 text-eco-green font-code py-2 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green flex items-center justify-center gap-2 group"
          >
            <span>Rate us on Product Hunt</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Recent Activity - Full Width */}
      <div className="bg-eco-darker p-6 rounded-lg border border-eco-dark">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-eco-green" />
          <h3 className="font-code text-eco-text">Recent Activity</h3>
        </div>
        <div className="space-y-6">
          {userData.recentQueries.map((query, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-l-2 pl-4 py-1"
              style={{
                borderColor: query.status === "error" ? "#ef4444" : "#10B981",
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Circle
                    className={`h-3 w-3 ${
                      query.status === "error"
                        ? "text-red-500"
                        : "text-eco-green"
                    }`}
                  />
                  <span className="text-eco-text font-code">{query.type}</span>
                </div>
                <div className="text-eco-gray text-sm mt-1 font-code">
                  {query.timestamp}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-code ${
                    query.status === "error" ? "text-red-500" : "text-eco-green"
                  }`}
                >
                  {query.credits} credits
                </span>
                <button
                  className="px-3 py-1 text-sm border border-eco-green/50 rounded-lg 
                           text-eco-green font-code bg-eco-green/5 hover:bg-eco-green/10 
                           transition-colors flex items-center gap-1"
                >
                  View Details
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
