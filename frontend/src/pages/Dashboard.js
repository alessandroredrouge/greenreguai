// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
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
  const { profile } = useUserProfile();
  const [recentActivity, setRecentActivity] = useState([]);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch available credits from user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      if (!profileError && profileData) {
        setAvailableCredits(profileData.credits);
      }

      // Fetch total credits used
      const { data: usageData, error: usageError } = await supabase
        .from("credit_transactions")
        .select("credits_amount")
        .eq("user_id", user.id)
        .eq("transaction_type", "usage");

      if (!usageError && usageData) {
        const total = usageData.reduce(
          (sum, transaction) => sum + transaction.credits_amount,
          0
        );
        setTotalCreditsUsed(total);
      }

      // Fetch recent activity
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages:messages(credits_used)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentActivity(
          data.map((conv) => ({
            id: conv.conversation_id,
            title: conv.title,
            timestamp: conv.updated_at,
            credits: conv.messages.reduce(
              (sum, msg) => sum + (msg.credits_used || 0),
              0
            ),
          }))
        );
      }
    };

    fetchData();
  }, [user]);

  const handleViewDetails = (conversationId) => {
    navigate(`/ai-assistant?conversation=${conversationId}`);
  };

  return (
    <div className="min-h-screen bg-harvey-bg p-4 sm:p-8">
      {/* Welcome Header - Modified for mobile */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-harvey-text text-xl sm:text-2xl mb-2 break-words font-medium">
              Welcome back,{" "}
              <span className="text-gray-700 truncate max-w-[200px] inline-block align-bottom">
                {profile?.email || user?.email || "User"}
              </span>
            </h1>
            <p className="text-harvey-text-light text-sm sm:text-base">
              Ready for your next query regarding renewable energy regulations?
            </p>
          </div>
          <UserMenu credits={profile?.credits || 0} />
        </div>
      </div>

      {/* Main Action Cards - Modified for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* New AI Query Card */}
        <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
          <div className="flex justify-center mb-4">
            <Bot className="h-12 w-12 text-gray-700" />
          </div>
          <h2 className="text-xl text-center text-harvey-text mb-3 font-medium">
            Ask the AI Assistant
          </h2>
          <p className="text-harvey-text-light text-center mb-6">
            Get instant AI-powered analysis of renewable energy regulations
          </p>
          <Link
            to="/ai-assistant"
            className="block text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all border border-gray-300 group"
          >
            Start New Query{" "}
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search Regulations Card */}
        <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-gray-700" />
          </div>
          <h2 className="text-xl text-center text-harvey-text mb-3 font-medium">
            Consult the Document Library
          </h2>
          <p className="text-harvey-text-light text-center mb-6">
            Browse and search through our comprehensive regulation database
          </p>
          <Link
            to="/document-library"
            className="block text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all border border-gray-300 group"
          >
            Search Official Documents{" "}
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats Grid - Modified for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Credit Usage - Adjusted for mobile */}
        <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
          <h2 className="text-xl text-harvey-text flex items-center gap-2 mb-4 font-medium">
            <Clock className="h-5 w-5 text-gray-700" />
            Credit Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-harvey-text-light mb-1">
                Credits Available
              </div>
              <div className="text-xl text-gray-700 font-medium">
                {availableCredits.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-harvey-text-light mb-1">
                Credits Used
              </div>
              <div className="text-xl text-harvey-text font-medium">
                {totalCreditsUsed.toLocaleString()}
              </div>
            </div>
          </div>
          <Link
            to="/billing"
            className="block text-center bg-gray-100 text-gray-700 py-2 px-4 
                     rounded-lg hover:bg-gray-200 transition-all border border-gray-300 
                     group mt-4"
          >
            Purchase Credits
            <ArrowRight className="inline ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Notification Center - Adjusted for mobile */}
        <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-700" />
              <h3 className="text-harvey-text font-medium">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                {1} new
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[160px] overflow-y-auto">
            <div className="p-2 rounded border border-harvey-border bg-harvey-bg">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-harvey-text">
                    Notification functionality coming soon
                  </p>
                  <p className="text-xs text-harvey-text-light mt-1">
                    System notifications will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect & Rate - Modified social links for mobile */}
        <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            <h3 className="text-harvey-text font-medium">Connect & Rate</h3>
          </div>

          {/* Social Links - Adjusted for mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            <a
              href="https://x.com/aleredrouge"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-harvey-border rounded-lg bg-harvey-bg hover:border-gray-400 transition-colors group flex flex-col items-center"
            >
              <div className="text-gray-700 text-xl mb-1">𝕏</div>
              <div className="text-harvey-text-light group-hover:text-harvey-text transition-colors text-xs">
                Follow
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/alessandro-rossi1/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-harvey-border rounded-lg bg-harvey-bg hover:border-gray-400 transition-colors group flex flex-col items-center"
            >
              <div className="text-gray-700 text-xl mb-1">in</div>
              <div className="text-harvey-text-light group-hover:text-harvey-text transition-colors text-xs">
                Connect
              </div>
            </a>

            <a
              href="mailto:greenreguai@outlook.com"
              className="p-2 border border-harvey-border rounded-lg bg-harvey-bg hover:border-gray-400 transition-colors group flex flex-col items-center"
            >
              <div className="text-gray-700 text-xl mb-1">@</div>
              <div className="text-harvey-text-light group-hover:text-harvey-text transition-colors text-xs">
                Email
              </div>
            </a>
          </div>

          {/* Product Hunt Rating */}
          <a
            href="https://www.producthunt.com/posts/greenreguai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-greenreguai"
            alt="GreenReguAI - AI platform for instant renewable energy compliance guidance |  Product Hunt"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all border border-gray-300 flex items-center justify-center gap-2 group"
          >
            <span>Rate us on Product Hunt</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Recent Activity - Modified for mobile */}
      <div className="bg-harvey-bg-lighter p-4 sm:p-6 rounded-lg border border-harvey-border shadow-sm">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Clock className="h-5 w-5 text-gray-700" />
          <h3 className="text-harvey-text font-medium">Recent Activity</h3>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-l-2 pl-4 py-1"
              style={{ borderColor: "#6B7280" }}
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <Circle className="h-3 w-3 text-gray-700" />
                  <span className="text-harvey-text text-sm sm:text-base truncate font-medium">
                    {activity.title}
                  </span>
                </div>
                <div className="text-harvey-text-light text-xs sm:text-sm mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-700 text-sm sm:text-base">
                  {activity.credits} credits
                </span>
                <button
                  onClick={() => handleViewDetails(activity.id)}
                  className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg 
                           text-gray-700 bg-gray-100 hover:bg-gray-200 
                           transition-colors flex items-center gap-1 whitespace-nowrap"
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
