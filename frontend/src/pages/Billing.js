import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Download } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function Billing() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [transactions, setTransactions] = useState([]);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!user) return;

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

    fetchTransactionHistory();
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
            Purchase credits to use GreenReguAI
          </p>
        </div>

        {/* Current Credits Status */}
        <div className="bg-eco-darker border border-eco-dark rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-code text-eco-gray mb-2">
                Credits Available
              </h3>
              <p className="text-2xl text-eco-green font-code">2,459</p>
            </div>
            <div>
              <h3 className="font-code text-eco-gray mb-2">Credit Usage</h3>
              <p className="text-eco-gray font-code">
                1 credit = 1 Basic AI Query
              </p>
            </div>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={`bg-eco-darker border rounded-lg transition-all ${
                pack.popular
                  ? "border-eco-green shadow-lg shadow-eco-green/20 scale-105"
                  : "border-eco-dark hover:border-eco-green"
              }`}
            >
              {pack.popular && (
                <div className="bg-eco-green/20 text-eco-green text-center py-2 rounded-t-lg font-code text-sm">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="font-code text-xl text-eco-text mb-2">
                  {pack.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-code text-eco-text">
                    ${pack.price}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="font-code text-eco-gray mb-2">
                    Credits Included
                  </div>
                  <div className="text-xl text-eco-green font-code">
                    {pack.credits.toLocaleString()}
                  </div>
                </div>
                <button className="w-full py-2 px-4 rounded-lg font-code transition-all bg-eco-green/10 text-eco-green border border-eco-green hover:bg-eco-green/20">
                  Purchase Credits
                </button>
                <div className="mt-6 space-y-3">
                  {pack.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-eco-gray"
                    >
                      <Check className="h-5 w-5 text-eco-green mr-2" />
                      <span className="font-code text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase History */}
        <div>
          <h2 className="font-code text-2xl text-eco-text mb-6">
            Purchase History
          </h2>
          <div className="bg-eco-darker border border-eco-dark rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-eco-dark">
                <tr>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Date
                  </th>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Description
                  </th>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Credits
                  </th>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Amount Paid
                  </th>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Status
                  </th>
                  <th className="text-left p-4 font-code text-eco-gray">
                    Stripe Payment ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-eco-dark"
                    >
                      <td className="p-4 font-code text-eco-text">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-code text-eco-text">
                        {transaction.description || `Credit Purchase`}
                      </td>
                      <td className="p-4 font-code text-eco-green">
                        {transaction.credits_amount.toLocaleString()}
                      </td>
                      <td className="p-4 font-code text-eco-text">
                        ${transaction.money_amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-4">
                        <span className="bg-eco-green/20 text-eco-green px-2 py-1 rounded-full text-sm font-code">
                          {transaction.status || "Paid"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {transaction.stripe_payment_id && (
                            <span className="font-code text-eco-gray text-sm">
                              {transaction.stripe_payment_id}
                            </span>
                          )}
                          {transaction.invoice_url && (
                            <a
                              href={transaction.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-eco-green hover:text-eco-text"
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
                      className="p-4 text-center font-code text-eco-gray"
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
  );
}
