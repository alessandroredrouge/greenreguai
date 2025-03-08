import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-harvey-bg p-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-harvey-text transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-harvey-text mb-8 font-medium">
          Terms and Conditions
        </h1>

        <div className="space-y-8 text-harvey-text-light">
          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              1. Service Description
            </h2>
            <p>
              GreenReguAI provides an AI-powered platform for accessing and
              querying renewable energy regulations. Our service operates on a
              credit-based system where users can purchase credits to make
              queries to our AI system.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              2. Credit System
            </h2>
            <p>
              Credits are non-refundable once used. Each query consumes a
              specific number of credits based on the complexity of the question
              (1 credit per query if not explicited otherwise). New users
              receive 50 free credits upon registration.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              3. User Responsibilities
            </h2>
            <p>
              Users are responsible for maintaining the confidentiality of their
              account credentials and for all activities conducted through their
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              4. Service Availability
            </h2>
            <p>
              While we strive for 100% uptime, we cannot guarantee uninterrupted
              access to our services. Maintenance and updates may occasionally
              affect service availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              5. Refund Policy
            </h2>
            <p>
              Unused credits may be refunded within 30 days of purchase. Refunds
              for used credits may be considered in cases of service malfunction
              or incorrect information provision.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              6. Data Usage
            </h2>
            <p>
              We collect and process user data in accordance with our Privacy
              Policy. Query history and usage patterns may be analyzed to
              improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-harvey-text mb-4 font-medium">
              7. Contact Information
            </h2>
            <p>
              For any questions regarding these terms, please contact us at:{" "}
              <a
                href="mailto:greenreguai@outlook.com"
                className="text-gray-700 hover:underline"
              >
                greenreguai@outlook.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 text-harvey-text-light text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
