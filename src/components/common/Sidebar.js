"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShieldCheck,
  Wrench,
  FileUp,
  LogOut,
  Anchor,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/products", icon: Package },
    { label: "Add Product", href: "/products/add", icon: PlusCircle },
    { label: "Warranty Lookup", href: "/warranty/lookup", icon: ShieldCheck },
    { label: "Repairs", href: "/repairs", icon: Wrench },
    { label: "Upload Warranty PDF", href: "/upload-warranty", icon: FileUp },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass-panel border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white tracking-wider">
                  bo<span className="text-red-500 font-extrabold">A</span>t
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
                  Warranty Hub
                </p>
              </div>
            </Link>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href.length > 9);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose && onClose()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600/30 to-red-900/10 text-white border border-red-500/40 shadow-lg shadow-red-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & User Profile */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="truncate">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || user?.email || "Admin User"}
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              Admin
            </span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-transparent transition-all duration-200 shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
