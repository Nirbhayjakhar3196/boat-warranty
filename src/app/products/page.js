"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiDelete } from "@/lib/api";
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Delete modal state
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", error: false });

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`);
      const list = Array.isArray(res?.data) ? res.data : [];
      setProducts(list);
    } catch (err) {
      console.error("Failed to load products:", err);
      setFeedback({ message: err.message || "Failed to load products", error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, page, searchTerm]);

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/products/${deleteProduct.id}`);
      setFeedback({ message: "Product deleted successfully", error: false });
      setDeleteProduct(null);
      fetchProducts();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete product", error: true });
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title="Products Management"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Product Database
              </h1>
              <p className="text-xs text-gray-400">
                View, filter, and manage registered boAt devices and warranty timelines
              </p>
            </div>

            <Link
              href="/products/add"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>

          {/* Feedback Toast Banner */}
          {feedback.message && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between border ${
                feedback.error
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}
            >
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback({ message: "", error: false })}
                className="text-xs underline font-semibold ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by serial or name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="text-xs text-gray-400 font-medium">
              Showing page {page} ({products.length} products on page)
            </div>
          </div>

          {/* Products Table Card */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No products found</p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchTerm ? "Try broadening your search query" : "Click 'Add New Product' to register your first product"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/30 text-gray-400 uppercase text-[11px] tracking-wider">
                      <th className="px-6 py-4 font-semibold">Serial Number</th>
                      <th className="px-6 py-4 font-semibold">Product Name</th>
                      <th className="px-6 py-4 font-semibold">Model</th>
                      <th className="px-6 py-4 font-semibold">Purchase Date</th>
                      <th className="px-6 py-4 font-semibold">Warranty Expiry</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((product) => {
                      const isExpired =
                        product.warrantyExpiry &&
                        new Date(product.warrantyExpiry) < new Date();

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4 font-mono font-bold text-red-400">
                            <Link
                              href={`/warranty/lookup?serial=${product.serialNumber}`}
                              className="hover:underline flex items-center space-x-1.5"
                            >
                              <span>{product.serialNumber}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-gray-300">{product.model}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {product.purchaseDate
                              ? new Date(product.purchaseDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {product.warrantyExpiry
                              ? new Date(product.warrantyExpiry).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              status={isExpired ? "Expired" : "Active"}
                              type="warranty"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/products/${product.id}/edit`}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => setDeleteProduct(product)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1.5 rounded-lg glass-panel text-xs text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-gray-400">Page {page}</span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={products.length < limit || loading}
                className="px-3 py-1.5 rounded-lg glass-panel text-xs text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        title="Confirm Delete Product"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs sm:text-sm">
              Are you sure you want to delete product{" "}
              <strong className="font-mono text-white">{deleteProduct?.serialNumber}</strong> (
              {deleteProduct?.name})? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setDeleteProduct(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Permanently</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
