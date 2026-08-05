"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import ProductForm from "@/components/products/ProductForm";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AddProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCreateProduct = async (formData) => {
    await apiPost("/api/products", formData);
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
          title="Add New Product"
        />

        <main className="p-4 sm:p-6 lg:p-8 flex justify-center items-start flex-1">
          <ProductForm isEdit={false} onSubmit={handleCreateProduct} />
        </main>
      </div>
    </div>
  );
}
