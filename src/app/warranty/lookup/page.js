"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import { apiGet } from "@/lib/api";
import {
  ShieldCheck,
  Search,
  Calendar,
  FileText,
  Wrench,
  AlertCircle,
  Loader2,
  Anchor,
  Clock,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function WarrantyLookupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSerial = searchParams.get("serial") || "";
  const [serialNumber, setSerialNumber] = useState(initialSerial);
  const [loading, setLoading] = useState(false);
  const [warrantyData, setWarrantyData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLookup = async (serialToSearch) => {
    const term = serialToSearch || serialNumber;
    if (!term.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setWarrantyData(null);

    // Update URL query string
    router.replace(`/warranty/lookup?serial=${encodeURIComponent(term.trim())}`);

    try {
      const res = await apiGet(`/api/warranty/${encodeURIComponent(term.trim())}`);
      if (res && res.data) {
        setWarrantyData(res.data);
      } else {
        throw new Error(res?.message || "Warranty details not found for this serial number.");
      }
    } catch (err) {
      console.error("Warranty lookup error:", err);
      setErrorMsg(err.message || "No warranty record found for the provided serial number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSerial) {
      handleLookup(initialSerial);
    }
  }, [initialSerial]);

  const calculateDaysRemaining = (expiryDateStr) => {
    if (!expiryDateStr) return 0;
    const now = new Date();
    const expiry = new Date(expiryDateStr);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Anchor className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-wider">
                bo<span className="text-red-500">A</span>t <span className="font-light">Warranty Lookup</span>
              </h1>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl glass-panel text-xs text-gray-300 hover:text-white flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 space-y-8 relative z-10">
        {/* Search Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Warranty Verification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Enter Product Serial Number
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Check active warranty period, coverage dates, official PDF documents, and filed repair logs instantly.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="glass-panel p-2 rounded-2xl border border-white/15 shadow-2xl flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Serial Number (e.g., BOAT001)..."
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-transparent border-none text-white placeholder-gray-500 text-sm sm:text-base font-mono uppercase focus:outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Lookup Warranty</span>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-6 rounded-2xl glass-panel border border-red-500/30 text-red-400 flex items-start space-x-4 animate-in fade-in">
            <XCircle className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
            <div>
              <h4 className="font-bold text-white text-base">Warranty Record Not Found</h4>
              <p className="text-xs text-gray-300 mt-1">{errorMsg}</p>
              <p className="text-[11px] text-gray-400 mt-2">
                Please double-check the serial number printed on your boAt product box or receipt.
              </p>
            </div>
          </div>
        )}

        {/* Result Breakdown Card */}
        {warrantyData && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Main Product Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Status Ribbon Glow */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
                  calculateDaysRemaining(
                    warrantyData.product?.warrantyExpiry || warrantyData.warrantyExpiry
                  ) > 0
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 font-mono font-bold text-xs border border-red-500/30">
                      {warrantyData.product?.serialNumber || warrantyData.serialNumber}
                    </span>
                    <StatusBadge
                      status={
                        calculateDaysRemaining(
                          warrantyData.product?.warrantyExpiry || warrantyData.warrantyExpiry
                        ) > 0
                          ? "Active"
                          : "Expired"
                      }
                      type="warranty"
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-wide">
                    {warrantyData.product?.name || warrantyData.name || "boAt Product"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Model: <span className="text-gray-200 font-medium">{warrantyData.product?.model || warrantyData.model}</span>
                  </p>
                </div>

                {/* Warranty Remaining Days Counter */}
                <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center sm:text-right">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Coverage Remaining
                  </span>
                  <div className="text-2xl font-extrabold text-white flex items-center justify-center sm:justify-end space-x-1 mt-0.5">
                    <Clock className="w-5 h-5 text-red-500" />
                    <span>
                      {Math.max(
                        0,
                        calculateDaysRemaining(
                          warrantyData.product?.warrantyExpiry || warrantyData.warrantyExpiry
                        )
                      )}
                    </span>
                    <span className="text-xs font-normal text-gray-400">Days</span>
                  </div>
                </div>
              </div>

              {/* Product Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-white/10">
                <div>
                  <p className="text-xs text-gray-400 flex items-center space-x-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Purchase Date</span>
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {(warrantyData.product?.purchaseDate || warrantyData.purchaseDate)
                      ? new Date(
                          warrantyData.product?.purchaseDate || warrantyData.purchaseDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 flex items-center space-x-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    <span>Warranty Expiry</span>
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {(warrantyData.product?.warrantyExpiry || warrantyData.warrantyExpiry)
                      ? new Date(
                          warrantyData.product?.warrantyExpiry || warrantyData.warrantyExpiry
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 flex items-center space-x-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Warranty Document</span>
                  </p>
                  {(warrantyData.product?.warrantyPdfUrl || warrantyData.warrantyPdfUrl) ? (
                    <a
                      href={warrantyData.product?.warrantyPdfUrl || warrantyData.warrantyPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-red-400 hover:text-red-300 underline"
                    >
                      <span>View PDF Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No PDF uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Repair History Section */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Servicing & Repair History</h3>
                  <p className="text-xs text-gray-400">
                    Logged service requests for this device
                  </p>
                </div>
              </div>

              {!warrantyData.repairHistory || warrantyData.repairHistory.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  No repair history found for this product. Device is in original servicing state.
                </div>
              ) : (
                <div className="space-y-4">
                  {warrantyData.repairHistory.map((repair, idx) => (
                    <div
                      key={repair.id || idx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <StatusBadge status={repair.status} type="repair" />
                          <span className="text-xs font-mono text-gray-400">
                            {repair.repairDate
                              ? new Date(repair.repairDate).toLocaleDateString()
                              : "Date N/A"}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">
                          Issue: {repair.issue}
                        </h4>
                        {repair.remarks && (
                          <p className="text-xs text-gray-400">
                            Technician Remarks: <span className="text-gray-300">{repair.remarks}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Boat Warranty Hub. Official Verification System.</p>
      </footer>
    </div>
  );
}

export default function WarrantyLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      }
    >
      <WarrantyLookupContent />
    </Suspense>
  );
}
