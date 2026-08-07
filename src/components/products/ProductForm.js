"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Hash, Tag, Calendar, FileText, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Toast from "@/components/common/Toast";

export default function ProductForm({ initialData = null, isEdit = false, onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    serialNumber: "",
    name: "",
    model: "",
    purchaseDate: "",
    warrantyExpiry: "",
    warrantyPdfUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (initialData) {
      // Format ISO dates to YYYY-MM-DD for date inputs
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
      };

      setFormData({
        serialNumber: initialData.serialNumber || "",
        name: initialData.name || "",
        model: initialData.model || "",
        purchaseDate: formatDate(initialData.purchaseDate),
        warrantyExpiry: formatDate(initialData.warrantyExpiry),
        warrantyPdfUrl: initialData.warrantyPdfUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload = {
      serialNumber: formData.serialNumber.trim(),
      name: formData.name.trim(),
      model: formData.model.trim(),
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      warrantyExpiry: new Date(formData.warrantyExpiry).toISOString(),
    };

    const warrantyPdfUrl = formData.warrantyPdfUrl.trim();
    if (warrantyPdfUrl) {
      payload.warrantyPdfUrl = warrantyPdfUrl;
    }

    return payload;
  };

  const validateForm = () => {
    const serialNumber = formData.serialNumber.trim();
    const name = formData.name.trim();
    const model = formData.model.trim();
    const purchaseDate = formData.purchaseDate.trim();
    const warrantyExpiry = formData.warrantyExpiry.trim();
    const warrantyPdfUrl = formData.warrantyPdfUrl.trim();

    if (!serialNumber || !name || !model || !purchaseDate || !warrantyExpiry) {
      return "Please fill in all required fields.";
    }

    const purchaseDateValue = new Date(purchaseDate);
    const warrantyExpiryValue = new Date(warrantyExpiry);

    if (Number.isNaN(purchaseDateValue.getTime()) || Number.isNaN(warrantyExpiryValue.getTime())) {
      return "Please enter valid purchase and warranty dates.";
    }

    if (warrantyExpiryValue <= purchaseDateValue) {
      return "Warranty expiry must be after the purchase date.";
    }

    if (warrantyPdfUrl) {
      try {
        new URL(warrantyPdfUrl);
      } catch {
        return "Please enter a valid warranty PDF URL or leave it empty.";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setToast({ message: "", type: "success" });

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();

      await onSubmit(payload);
      const successMessage = isEdit ? "Product updated successfully!" : "Product created successfully!";
      setSuccess(successMessage);
      setToast({ message: successMessage, type: "success" });
      setTimeout(() => {
        router.push("/products");
      }, 1200);
    } catch (err) {
      const message = err?.message || "Failed to save product. Please check input data.";
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Product Details" : "Register New Product"}
          </h2>
          <p className="text-xs text-gray-400">
            {isEdit
              ? "Update product specifications and warranty timeline"
              : "Enter product details to create a warranty tracking record"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/products")}
          className="px-3.5 py-2 rounded-xl glass-panel text-xs text-gray-300 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success} Redirecting to products list...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Serial Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Serial Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="serialNumber"
                required
                placeholder="e.g. BOAT001"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500 font-mono"
              />
              <Hash className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. boAt Airdopes 141"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500"
              />
              <Package className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Model Number / Variant <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="model"
                required
                placeholder="e.g. 141 ANC"
                value={formData.model}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500"
              />
              <Tag className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Warranty PDF URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Warranty PDF URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                name="warrantyPdfUrl"
                placeholder="https://example.com/warranty.pdf"
                value={formData.warrantyPdfUrl}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500"
              />
              <FileText className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="purchaseDate"
                required
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Warranty Expiry Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Warranty Expiry Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="warrantyExpiry"
                required
                value={formData.warrantyExpiry}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-500"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Product" : "Create Product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
