"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, Search, ShieldCheck, Wrench, FileText, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  const [serialNumber, setSerialNumber] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (serialNumber.trim()) {
      router.push(`/warranty/lookup?serial=${encodeURIComponent(serialNumber.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-white tracking-wider">
                bo<span className="text-red-500">A</span>t
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                Warranty Hub
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/warranty/lookup"
              className="text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Warranty Lookup
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all hover:scale-105"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Official boAt Product Assurance</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Instant Warranty & <br />
          <span className="boat-brand-text">Repair Status Checker</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Verify your boAt device warranty validity, explore repair history, and view official warranty PDF documents seamlessly.
        </p>

        {/* Search Bar Widget */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl glass-panel p-2 rounded-2xl border border-white/15 shadow-2xl flex items-center space-x-2 mb-12"
        >
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Product Serial Number (e.g. BOAT001)..."
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-transparent border-none text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 flex items-center space-x-2 transition-all hover:scale-105 shrink-0"
          >
            <span>Verify Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl text-left">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Live Expiry Check</h3>
            <p className="text-xs text-gray-400">
              Calculate active warranty status & remaining coverage days in real-time.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">Repair Timeline</h3>
            <p className="text-xs text-gray-400">
              Track filed issues, repair progress, technician notes, and servicing updates.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">PDF Certificates</h3>
            <p className="text-xs text-gray-400">
              View and download officially registered warranty PDF certificates.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Boat Warranty Hub. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-gray-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <Link href="/warranty/lookup" className="hover:text-white transition-colors">
              Warranty Lookup
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
