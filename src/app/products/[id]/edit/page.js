"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import ProductForm from "@/components/products/ProductForm";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPut } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditProductPage({ params }) {
  // Next.js 15+ params promise unwrapping
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await apiGet(`/api/products/${productId}`);
        if (res && res.data) {
          setProduct(res.data);
        } else {
          throw new Error("Product data not found");
        }
      } catch (err) {
        setFetchError(err.message || "Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && productId) {
      loadProduct();
    }
  }, [isAuthenticated, productId]);

  const handleUpdateProduct = async (formData) => {
    await apiPut(`/api/products/${productId}`, formData);
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
          title={`Edit Product #${productId}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex justify-center items-start flex-1">
          {loading ? (
            <div className="py-20 flex justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : fetchError ? (
            <div className="p-6 rounded-2xl glass-panel border border-red-500/30 text-red-400 max-w-lg text-center space-y-4">
              <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
              <h3 className="text-lg font-bold text-white">Product Not Found</h3>
              <p className="text-xs text-gray-400">{fetchError}</p>
              <button
                onClick={() => router.push("/products")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Return to Products List
              </button>
            </div>
          ) : (
            <ProductForm
              initialData={product}
              isEdit={true}
              onSubmit={handleUpdateProduct}
            />
          )}
        </main>
      </div>
    </div>
  );
}
