"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import {
  Wrench,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Loader2,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function RepairsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [repairs, setRepairs] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Add / Edit Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRepair, setEditRepair] = useState(null);
  const [deleteRepair, setDeleteRepair] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    productId: "",
    issue: "",
    status: "Pending",
    remarks: "",
    repairDate: new Date().toISOString().split("T")[0],
  });

  const [feedback, setFeedback] = useState({ message: "", error: false });

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repairsRes, productsRes] = await Promise.all([
        apiGet("/api/repairs").catch(() => ({ data: [] })),
        apiGet("/api/products?limit=100").catch(() => ({ data: [] })),
      ]);

      const repairList = Array.isArray(repairsRes?.data) ? repairsRes.data : [];
      const productList = Array.isArray(productsRes?.data) ? productsRes.data : [];

      setRepairs(repairList);
      setProducts(productList);
    } catch (err) {
      console.error("Failed to load repair data:", err);
      setFeedback({ message: err.message || "Failed to load repair data", error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const openAddModal = () => {
    setFormData({
      productId: products.length > 0 ? products[0].id : "",
      issue: "",
      status: "Pending",
      remarks: "",
      repairDate: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (repair) => {
    setEditRepair(repair);
    setFormData({
      productId: repair.productId || "",
      issue: repair.issue || "",
      status: repair.status || "Pending",
      remarks: repair.remarks || "",
      repairDate: repair.repairDate
        ? new Date(repair.repairDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveRepair = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.issue) {
      setFeedback({ message: "Product and Issue description are required", error: true });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId: Number(formData.productId),
        issue: formData.issue,
        status: formData.status,
        remarks: formData.remarks,
        repairDate: formData.repairDate ? new Date(formData.repairDate).toISOString() : new Date().toISOString(),
      };

      if (editRepair) {
        await apiPut(`/api/repairs/${editRepair.id}`, payload);
        setFeedback({ message: "Repair record updated successfully!", error: false });
        setEditRepair(null);
      } else {
        await apiPost("/api/repairs", payload);
        setFeedback({ message: "New repair ticket created successfully!", error: false });
        setIsAddModalOpen(false);
      }

      fetchData();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save repair record", error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRepair) return;
    setSubmitting(true);
    try {
      await apiDelete(`/api/repairs/${deleteRepair.id}`);
      setFeedback({ message: "Repair ticket deleted successfully", error: false });
      setDeleteRepair(null);
      fetchData();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete repair ticket", error: true });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering repairs
  const filteredRepairs = repairs.filter((r) => {
    const matchesStatus =
      statusFilter === "all" ||
      (r.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      (r.issue || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.remarks || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.productId).includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

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
          title="Repair Management"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Repair History & Tickets
              </h1>
              <p className="text-xs text-gray-400">
                File new servicing tickets, update repair statuses, and manage remarks
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log New Repair</span>
            </button>
          </div>

          {/* Feedback Banner */}
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

          {/* Filter & Search Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search issue or product ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["all", "pending", "in progress", "completed", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all capitalize whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Repair Tickets Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : filteredRepairs.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">No repair records found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Click &apos;Log New Repair&apos; to create a new servicing ticket
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/30 text-gray-400 uppercase text-[11px] tracking-wider">
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Reported Issue</th>
                      <th className="px-6 py-4 font-semibold">Repair Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Remarks</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRepairs.map((repair) => {
                      const matchedProduct = products.find((p) => p.id === repair.productId);

                      return (
                        <tr key={repair.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">
                              {matchedProduct ? matchedProduct.name : `Product #${repair.productId}`}
                            </div>
                            <div className="text-xs font-mono text-red-400">
                              {matchedProduct ? matchedProduct.serialNumber : `ID: ${repair.productId}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-200 font-medium max-w-xs">
                            {repair.issue}
                          </td>
                          <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                            {repair.repairDate
                              ? new Date(repair.repairDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={repair.status} type="repair" />
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                            {repair.remarks || <span className="italic text-gray-600">None</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openEditModal(repair)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Edit Repair Status"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteRepair(repair)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                title="Delete Repair Record"
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
          </div>
        </main>
      </div>

      {/* Add / Edit Repair Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editRepair}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditRepair(null);
        }}
        title={editRepair ? "Update Repair Ticket" : "Log New Repair Ticket"}
      >
        <form onSubmit={handleSaveRepair} className="space-y-4">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              name="productId"
              required
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
            >
              <option value="" disabled className="bg-[#0b0f17] text-gray-400">
                -- Choose a Product --
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0b0f17] text-white">
                  {p.serialNumber} - {p.name} ({p.model})
                </option>
              ))}
            </select>
          </div>

          {/* Reported Issue */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Reported Issue / Defect <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Right earbud speaker not producing audio, battery draining fast..."
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Repair Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Repair Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
            >
              <option value="Pending" className="bg-[#0b0f17]">Pending</option>
              <option value="In Progress" className="bg-[#0b0f17]">In Progress</option>
              <option value="Completed" className="bg-[#0b0f17]">Completed</option>
              <option value="Rejected" className="bg-[#0b0f17]">Rejected</option>
            </select>
          </div>

          {/* Technician Remarks */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Technician Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Replaced driver unit under warranty coverage."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Repair Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Servicing / Repair Date
            </label>
            <input
              type="date"
              value={formData.repairDate}
              onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditRepair(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editRepair ? "Update Ticket" : "Create Ticket"}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Repair Confirmation Modal */}
      <Modal
        isOpen={!!deleteRepair}
        onClose={() => setDeleteRepair(null)}
        title="Confirm Delete Repair Record"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-xs sm:text-sm">
              Are you sure you want to delete repair ticket #{deleteRepair?.id} (
              {deleteRepair?.issue})? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setDeleteRepair(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Ticket</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
