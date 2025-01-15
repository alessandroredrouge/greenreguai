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
    <div className="min-h-screen bg-eco-black p-4 sm:p-8">
      {/* Welcome Header - Modified for mobile */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-code text-eco-text text-xl sm:text-2xl mb-2 break-words">
              Welcome back,{" "}
              <span className="text-eco-green truncate max-w-[200px] inline-block align-bottom">
                {profile?.email || user?.email || "User"}
              </span>
            </h1>
            <p className="font-code text-eco-gray text-sm sm:text-base">
              &gt; Ready for your next query regarding renewable energy
              regulations? :)
            </p>
          </div>
          <UserMenu credits={profile?.credits || 0} />
        </div>
      </div>

      {/* Main Action Cards - Modified for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* New AI Query Card */}
        <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
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
        <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
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

      {/* Stats Grid - Modified for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Credit Usage - Adjusted for mobile */}
        <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
          <h2 className="font-code text-xl text-eco-text flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-eco-green" />
            Credit Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-eco-gray mb-1 font-code">
                Credits Available
              </div>
              <div className="text-xl text-eco-green font-code">
                {availableCredits.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-eco-gray mb-1 font-code">
                Credits Used
              </div>
              <div className="text-xl text-eco-text font-code">
                {totalCreditsUsed.toLocaleString()}
              </div>
            </div>
          </div>
          <Link
            to="/billing"
            className="block text-center bg-eco-green/10 text-eco-green font-code py-2 px-4 
                     rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green 
                     group mt-4"
          >
            Purchase Credits
            <ArrowRight className="inline ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Notification Center - Adjusted for mobile */}
        <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-eco-green" />
              <h3 className="font-code text-eco-text">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-eco-green bg-eco-green/10 px-2 py-1 rounded-full font-code">
                {1} new
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[160px] overflow-y-auto">
            <div className="p-2 rounded border border-eco-dark/50 bg-eco-dark/10">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-eco-text font-code">
                    Notification functionality coming soon
                  </p>
                  <p className="text-xs text-eco-gray mt-1">
                    System notifications will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect & Rate - Modified social links for mobile */}
        <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <MessageSquare className="h-5 w-5 text-eco-green" />
            <h3 className="font-code text-eco-text">Connect & Rate</h3>
          </div>

          {/* Social Links - Adjusted for mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
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
              href="mailto:greenreguai@outlook.com"
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
            href="https://www.producthunt.com/posts/greenreguai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-greenreguai"
            alt="GreenReguAI - AI platform for instant renewable energy compliance guidance |  Product Hunt"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-eco-green/10 text-eco-green font-code py-2 px-4 rounded-lg hover:bg-eco-green/20 transition-all border border-eco-green flex items-center justify-center gap-2 group"
          >
            <span>Rate us on Product Hunt</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Recent Activity - Modified for mobile */}
      <div className="bg-eco-darker p-4 sm:p-6 rounded-lg border border-eco-dark">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Clock className="h-5 w-5 text-eco-green" />
          <h3 className="font-code text-eco-text">Recent Activity</h3>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-l-2 pl-4 py-1"
              style={{ borderColor: "#10B981" }}
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <Circle className="h-3 w-3 text-eco-green" />
                  <span className="text-eco-text font-code text-sm sm:text-base truncate">
                    {activity.title}
                  </span>
                </div>
                <div className="text-eco-gray text-xs sm:text-sm mt-1 font-code">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="font-code text-eco-green text-sm sm:text-base">
                  {activity.credits} credits
                </span>
                <button
                  onClick={() => handleViewDetails(activity.id)}
                  className="px-3 py-1 text-xs sm:text-sm border border-eco-green/50 rounded-lg 
                           text-eco-green font-code bg-eco-green/5 hover:bg-eco-green/10 
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
