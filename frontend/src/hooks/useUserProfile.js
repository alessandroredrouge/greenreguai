import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext"; // Update import path

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [creditInfo, setCreditInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        // Fetch basic profile info
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch credit transactions
        const { data: transactionsData, error: transactionsError } =
          await supabase
            .from("credit_transactions")
            .select("amount, transaction_type")
            .eq("user_id", user.id);

        if (transactionsError) throw transactionsError;

        // Calculate credit totals
        const creditTotals = transactionsData.reduce(
          (acc, transaction) => {
            const amount = Math.abs(transaction.amount);
            if (transaction.transaction_type === "purchase") {
              acc.total_purchased += amount;
            } else if (transaction.transaction_type === "usage") {
              acc.total_used += amount;
            }
            return acc;
          },
          { total_purchased: 0, total_used: 0 }
        );

        setProfile(profileData);
        setCreditInfo(creditTotals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  return { profile, creditInfo, loading, error };
}
