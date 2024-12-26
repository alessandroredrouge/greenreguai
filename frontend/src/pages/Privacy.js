import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-eco-black p-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-eco-green hover:text-eco-text transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-code">Back to Home</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="font-code text-3xl text-eco-text mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-eco-gray">
          <section>
            <h2 className="text-xl text-eco-text mb-4">1. Data Collection</h2>
            <p>
              GreenReguAI collects and stores only essential data required for
              service operation:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Email address (for account identification and communication)
              </li>
              <li>Credit transactions and available credits</li>
              <li>Conversations and messages history with our AI system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">
              2. Third-Party Services
            </h2>
            <p>
              We partner with trusted services to handle sensitive information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Authentication (including password management) is handled by
                Supabase
              </li>
              <li>
                Payment processing and credit card information is managed by
                Stripe
              </li>
              <li>
                Neither passwords nor payment details are stored directly by
                GreenReguAI
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">3. Data Usage</h2>
            <p>Your data is used exclusively for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Providing and maintaining your service access</li>
              <li>
                Processing your queries and maintaining conversation history
              </li>
              <li>Managing your credit balance and transactions</li>
              <li>Improving our AI system's response accuracy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">4. Data Protection</h2>
            <p>
              We implement security measures to protect your
              data thanks to our partners.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">5. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You can
              request data deletion by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Export your conversation history</li>
              <li>Close your account at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-eco-text mb-4">
              7. Contact Information
            </h2>
            <p>
              For privacy-related questions, please contact us at:{" "}
              <a
                href="mailto:greenreguai@outlook.com"
                className="text-eco-green hover:underline"
              >
                greenreguai@outlook.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 text-eco-gray text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
