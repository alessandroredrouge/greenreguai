import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function UserMenu({ credits }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <div className="text-gray-700 font-medium text-sm">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 sm:w-64 bg-harvey-bg-lighter border border-harvey-border 
                        rounded-lg shadow-lg py-2 z-50"
        >
          <div className="px-3 sm:px-4 py-2 border-b border-harvey-border">
            <p className="text-harvey-text text-sm truncate">{user?.email}</p>
            <p className="text-gray-600 text-xs sm:text-sm">
              {credits} credits available
            </p>
          </div>

          <div className="py-2">
            {/* TODO: Add settings page */}
            {/* <Link
              to="/settings"
              className="px-4 py-2 text-harvey-text-light hover:text-harvey-text hover:bg-harvey-hover flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link> */}
            <Link
              to="/billing"
              className="px-4 py-2 text-harvey-text-light hover:text-harvey-text hover:bg-harvey-hover flex items-center gap-2 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Purchase Credits
            </Link>
          </div>

          <div className="px-4 py-3 border-t border-harvey-border">
            <button
              onClick={handleLogout}
              className="w-full text-center bg-gray-100 text-gray-700 py-2 px-4 
                       rounded-lg hover:bg-gray-200 transition-all border border-gray-300
                       flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
