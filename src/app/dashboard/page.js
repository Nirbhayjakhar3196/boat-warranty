"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  PlusCircle,
  FileUp,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeWarranties: 0,
    expiredWarranties: 0,
    pendingRepairs: 0,
  });

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Products and Repairs simultaneously
      const [productsRes, repairsRes] = await Promise.all([
        apiGet("/api/products?limit=100").catch(() => ({ data: [] })),
        apiGet("/api/repairs").catch(() => ({ data: [] })),
      ]);

      const productList = Array.isArray(productsRes?.data) ? productsRes.data : [];
      const repairList = Array.isArray(repairsRes?.data) ? repairsRes.data : [];

      setProducts(productList);
      setRepairs(repairList);

      // Compute statistics dynamically
      const now = new Date();
      let activeCount = 0;
      let expiredCount = 0;

      productList.forEach((p) => {
        if (p.warrantyExpiry) {
          const expiryDate = new Date(p.warrantyExpiry);
          if (expiryDate >= now) {
            activeCount++;
          } else {
            expiredCount++;
          }
        }
      });

      const pendingCount = repairList.filter(
        (r) => (r.status || "").toLowerCase() === "pending"
      ).length;

      setStats({
        totalProducts: productList.length,
        activeWarranties: activeCount,
        expiredWarranties: expiredCount,
        pendingRepairs: pendingCount,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title="Dashboard Overview"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Welcome back to Admin Portal
              </h1>
              <p className="text-xs text-gray-400">
                Real-time metrics, warranty status, and repair tracking overview
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-2.5 rounded-xl glass-panel text-gray-300 hover:text-white hover:border-white/20 transition-all flex items-center space-x-2 text-xs font-medium"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-500" : ""}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <Link
                href="/products/add"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>

          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Registered Products"
              value={loading ? "--" : stats.totalProducts}
              subtitle="Database registered items"
              icon={Package}
              color="blue"
            />

            <StatCard
              title="Active Warranties"
              value={loading ? "--" : stats.activeWarranties}
              subtitle="Valid warranty coverage"
              icon={ShieldCheck}
              color="emerald"
            />

            <StatCard
              title="Expired Warranties"
              value={loading ? "--" : stats.expiredWarranties}
              subtitle="Coverage period ended"
              icon={ShieldAlert}
              color="red"
            />

            <StatCard
              title="Pending Repairs"
              value={loading ? "--" : stats.pendingRepairs}
              subtitle="Awaiting technician review"
              icon={Wrench}
              color="amber"
            />
          </div>

          {/* Quick Action Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/products/add"
              className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Add New Product</h4>
                  <p className="text-xs text-gray-400">Register serial & dates</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/repairs"
              className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Manage Repairs</h4>
                  <p className="text-xs text-gray-400">Update issue statuses</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/upload-warranty"
              className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Upload Warranty PDF</h4>
                  <p className="text-xs text-gray-400">Attach document to product</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Two Columns Section: Recent Products & Recent Repairs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Products (2 Cols) */}
            <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Recent Products</h3>
                    <p className="text-xs text-gray-400">Latest products registered in system</p>
                  </div>
                  <Link
                    href="/products"
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 flex justify-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">
                    No products registered yet. Click &quot;Add Product&quot; to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Serial Number</th>
                          <th className="pb-3 font-semibold">Product Name</th>
                          <th className="pb-3 font-semibold">Model</th>
                          <th className="pb-3 font-semibold">Warranty Expiry</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {products.slice(0, 5).map((p) => {
                          const isExpired = p.warrantyExpiry && new Date(p.warrantyExpiry) < new Date();
                          return (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 font-mono font-bold text-red-400">
                                <Link href={`/warranty/lookup?serial=${p.serialNumber}`} className="hover:underline">
                                  {p.serialNumber}
                                </Link>
                              </td>
                              <td className="py-3.5 font-medium text-white">{p.name}</td>
                              <td className="py-3.5 text-gray-300">{p.model}</td>
                              <td className="py-3.5 text-gray-400">
                                {p.warrantyExpiry
                                  ? new Date(p.warrantyExpiry).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "N/A"}
                              </td>
                              <td className="py-3.5">
                                <StatusBadge status={isExpired ? "Expired" : "Active"} type="warranty" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Repairs Activity (1 Col) */}
            <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Repair Activity</h3>
                    <p className="text-xs text-gray-400">Recent servicing requests</p>
                  </div>
                  <Link
                    href="/repairs"
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center space-x-1"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 flex justify-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  </div>
                ) : repairs.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">
                    No repair history recorded.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repairs.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-bold text-gray-300">
                            Product #{r.productId}
                          </span>
                          <StatusBadge status={r.status} type="repair" />
                        </div>
                        <p className="text-xs text-white font-medium line-clamp-1">{r.issue}</p>
                        {r.repairDate && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            {new Date(r.repairDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
