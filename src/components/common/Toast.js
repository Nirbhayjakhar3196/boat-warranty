"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`glass-panel p-4 rounded-2xl border shadow-2xl flex items-center space-x-3 max-w-md ${
          isError
            ? "border-red-500/40 bg-red-950/80 text-red-300"
            : "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}

        <div className="flex-1 text-xs sm:text-sm font-medium pr-2">
          {message}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
