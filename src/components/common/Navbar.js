"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onMenuToggle, title = "Admin Dashboard" }) {
  const [quickSearch, setQuickSearch] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/warranty/lookup?serial=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
          <p className="text-xs text-gray-400">Boat Warranty & Repair Management</p>
        </div>
      </div>

      {/* Center Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md mx-4 relative"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Quick Warranty Search (e.g. BOAT001)..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder-gray-500 focus:ring-1 focus:ring-red-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
            title="Lookup Serial Number"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* User Header Info */}
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-200">
            {user?.name || "Admin User"}
          </span>
          <span className="text-[10px] text-gray-400">System Admin</span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/20 flex items-center justify-center text-gray-200 shadow-md">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
