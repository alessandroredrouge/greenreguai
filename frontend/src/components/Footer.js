import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-harvey-sidebar border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              <span className="text-gray-300">&gt;_</span>GreenReguAI
            </h3>

            <p className="text-gray-400 text-sm">
              AI-powered platform providing instant access to renewable energy
              regulations and compliance guidance. Our service offers
              credit-based queries to a comprehensive database of regulatory
              documents with direct source verification and citations.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("top")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ~/home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ~/features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ~/pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ~/about
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ~/contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ~/privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ~/terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">
              Customer Support()
            </h4>
            <div className="text-gray-400">
              <p className="mb-2">
                Questions or inquiries? Contact the GreenReguAI team at:
              </p>
              <a
                href="mailto:greenreguai@outlook.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                greenreguai@outlook.com
              </a>
            </div>
          </div>
          {/* <div>
            <h4 className="text-white font-semibold mb-4">
              Stay in the loop()
            </h4>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                subscribe()
              </button>
            </form>
          </div> */}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col-reverse md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mt-4 md:mt-0">
            <code>© 2024 GreenReguAI. All rights reserved._</code>
          </div>
          <button
            onClick={() => scrollToSection("top")}
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <span>back_to_top()</span>
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
