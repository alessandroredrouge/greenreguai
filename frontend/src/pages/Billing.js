import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Download } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { createCheckoutSession } from "../lib/api";

export default function Billing() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [selectedPack, setSelectedPack] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
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

      // Fetch purchase history
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("transaction_type", "purchase")
        .order("created_at", { ascending: false });

      if (!purchaseError && purchaseData) {
        setTransactions(purchaseData);
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
    };

    fetchUserData();
  }, [user]);

  const creditPacks = [
    {
      name: "Starter Pack",
      credits: 100,
      price: 5,
      pricePerCredit: 0.05,
      features: ["Perfect to get a feeling of GreenReguAI"],
    },
    {
      name: "Convenience Pack",
      credits: 500,
      price: 20,
      pricePerCredit: 0.04,
      popular: true,
      features: ["For who understood GreenReguAI's value <3"],
    },
  ];

  const handlePurchase = (pack) => {
    const paymentLinks = {
      "Starter Pack": "https://buy.stripe.com/6oE4i044u18zdVKcMM",
      "Convenience Pack": "https://buy.stripe.com/dR629S0Sig3t2d24gh",
    };

    const link = paymentLinks[pack.name];
    if (link) {
      window.location.href = link;
    } else {
      console.error("Invalid pack selection");
    }
  };

  return (
    <div className="min-h-screen bg-harvey-bg p-8">
      {/* Back Button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-harvey-text transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-harvey-text mb-2 font-medium">
            Billing & Credits
          </h1>
          <p className="text-harvey-text-light">
            Purchase credits to use GreenReguAI
          </p>
        </div>

        {/* Current Credits Status */}
        <div className="bg-harvey-bg-lighter border border-harvey-border rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-harvey-text-light mb-2">Credits Available</h3>
              <p className="text-2xl text-gray-700 font-medium">
                {availableCredits.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-harvey-text-light mb-2">Credits Used</h3>
              <p className="text-2xl text-harvey-text font-medium">
                {totalCreditsUsed.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-harvey-text-light">
              <span className="text-gray-700">1 credit</span> = 1 Basic AI Query
              • <span className="text-gray-700">X credits</span> = 1 Advanced AI
              Query (soon available)
            </p>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={`bg-harvey-bg-lighter border rounded-lg transition-all shadow-sm ${
                pack.popular
                  ? "border-gray-400 shadow-md scale-105"
                  : "border-harvey-border hover:border-gray-400"
              }`}
            >
              {pack.popular && (
                <div className="bg-gray-100 text-gray-700 text-center py-2 rounded-t-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl text-harvey-text mb-2 font-medium">
                  {pack.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl text-harvey-text font-medium">
                    ${pack.price}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="text-harvey-text-light mb-2">
                    Credits Included
                  </div>
                  <div className="text-xl text-gray-700 font-medium">
                    {pack.credits.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(pack)}
                  className="w-full py-2 px-4 rounded-lg transition-all bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                >
                  Purchase Credits
                </button>
                <div className="mt-6 space-y-3">
                  {pack.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-harvey-text-light"
                    >
                      <Check className="h-5 w-5 text-gray-700 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-red-600">
                  Please use the same email in the Stripe payment process that
                  you used to create your GreenReguAI account to associate the
                  added credits to your account.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase History */}
        <div>
          <h2 className="text-2xl text-harvey-text mb-6 font-medium">
            Purchase History
          </h2>
          <div className="bg-harvey-bg-lighter border border-harvey-border rounded-lg overflow-x-auto shadow-sm">
            <div className="min-w-[900px]">
              <table className="w-full">
                <thead className="border-b border-harvey-border">
                  <tr>
                    <th className="text-left p-4 text-harvey-text-light">
                      Date
                    </th>
                    <th className="text-left p-4 text-harvey-text-light">
                      Description
                    </th>
                    <th className="text-left p-4 text-harvey-text-light">
                      Credits
                    </th>
                    <th className="text-left p-4 text-harvey-text-light">
                      Amount Paid
                    </th>
                    <th className="text-left p-4 text-harvey-text-light">
                      Status
                    </th>
                    <th className="text-left p-4 text-harvey-text-light">
                      Stripe Payment ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-harvey-border"
                      >
                        <td className="p-4 text-harvey-text">
                          {new Date(
                            transaction.created_at
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-harvey-text">
                          {transaction.description || `Credit Purchase`}
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          {transaction.credits_amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-harvey-text">
                          ${transaction.money_amount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                            {transaction.status || "Paid"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {transaction.stripe_payment_id && (
                              <span className="text-harvey-text-light text-sm">
                                {transaction.stripe_payment_id}
                              </span>
                            )}
                            {transaction.invoice_url && (
                              <a
                                href={transaction.invoice_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-harvey-text"
                              >
                                <Download className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-4 text-center text-harvey-text-light"
                      >
                        No purchase history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
