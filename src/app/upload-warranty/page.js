"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiUpload } from "@/lib/api";

import {
  FileUp,
  FileText,
  Package,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";

export default function UploadWarrantyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Result Feedback State
  const [feedback, setFeedback] = useState({ message: "", error: false, url: "" });

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await apiGet("/api/products?limit=100");
      const list = Array.isArray(res?.data) ? res.data : [];
      setProducts(list);
      if (list.length > 0) {
        setSelectedProductId(String(list[0].id));
      }
    } catch (err) {
      console.error("Failed to load products for PDF upload:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleFileSelect = (file) => {
    setFeedback({ message: "", error: false, url: "" });

    if (!file) return;

    if (file.type !== "application/pdf") {
      setFeedback({
        message: "Invalid file format. Only PDF documents (.pdf) are allowed.",
        error: true,
        url: "",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        message: "File size exceeds the 5MB limit. Please choose a smaller PDF.",
        error: true,
        url: "",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setFeedback({ message: "Please select a target product.", error: true, url: "" });
      return;
    }

    if (!selectedFile) {
      setFeedback({ message: "Please choose a PDF document to upload.", error: true, url: "" });
      return;
    }

    setUploading(true);
    setFeedback({ message: "", error: false, url: "" });

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("productId", selectedProductId);

      const res = await apiUpload("/api/upload", formData);

      const uploadedUrl = res.url || res.data?.warrantyPdfUrl || "";

      setFeedback({
        message: "Warranty PDF uploaded and attached successfully!",
        error: false,
        url: uploadedUrl,
      });

      setSelectedFile(null);
      fetchProducts();
    } catch (err) {
      setFeedback({
        message: err.message || "Failed to upload warranty PDF document.",
        error: true,
        url: "",
      });
    } finally {
      setUploading(false);
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
          title="Upload Warranty PDF"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Warranty PDF Uploader
            </h1>
            <p className="text-xs text-gray-400">
              Upload official warranty certificate documents and link them to registered products
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Upload Box (2 Cols) */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Select Target Product <span className="text-red-500">*</span>
                  </label>
                  {loadingProducts ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      <span>Loading products...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-xs text-red-400 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      No products registered. Please add a product first before uploading PDFs.
                    </div>
                  ) : (
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#0b0f17] text-white">
                          {p.serialNumber} - {p.name} ({p.model})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Drag and Drop Zone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Upload PDF Document <span className="text-red-500">*</span>
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                      isDragging
                        ? "border-red-500 bg-red-500/10 scale-[0.99]"
                        : selectedFile
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-white/15 bg-black/20 hover:border-white/30 hover:bg-white/5"
                    }`}
                    onClick={() => document.getElementById("pdfInput").click()}
                  >
                    <input
                      id="pdfInput"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />

                    {selectedFile ? (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Upload
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-600 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove File</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Click to select or drag and drop PDF file
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF format only (Maximum file size: 5 MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Alerts */}
                {feedback.message && (
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm flex flex-col space-y-2 border ${
                      feedback.error
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {feedback.error ? (
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                      )}
                      <span className="font-semibold">{feedback.message}</span>
                    </div>

                    {feedback.url && (
                      <div className="pl-7">
                        <a
                          href={feedback.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 font-mono underline"
                        >
                          <span>Open PDF Document ({feedback.url})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile || products.length === 0}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading PDF Document...</span>
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4" />
                        <span>Upload & Attach PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Side Panel: Linked Certificates (1 Col) */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Attached Certificates</h3>
                    <p className="text-xs text-gray-400">Products with uploaded PDF docs</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {products
                    .filter((p) => p.warrantyPdfUrl)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[140px]">
                            {p.name}
                          </p>
                          <p className="text-[10px] font-mono text-red-400">{p.serialNumber}</p>
                        </div>

                        <a
                          href={p.warrantyPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                          title="View PDF"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}

                  {products.filter((p) => p.warrantyPdfUrl).length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-500 italic">
                      No warranty PDFs attached yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
