import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Boat Warranty Hub - Product & Warranty Management System",
  description: "Official boAt Product Warranty Lookup, Repair Tracker & Admin Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-gray-100 selection:bg-red-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
