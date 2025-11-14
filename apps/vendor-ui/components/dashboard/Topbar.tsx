"use client";

import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface TopbarProps {
  toggleSidebar: () => void;
  title?: string;
}

interface Vendor {
  businessName?: string;
  email?: string;
}

export default function Topbar({
  toggleSidebar,
  title = "Dashboard",
}: TopbarProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user"); // ✅ use "user" instead of "vendorData"
      console.log("🧩 LocalStorage user:", stored);

      if (stored) {
        const parsed = JSON.parse(stored);
        const vendorInfo = parsed?.vendor || null;

        if (vendorInfo) {
          setVendor(vendorInfo);
          console.log("✅ Vendor loaded:", vendorInfo);
        } else {
          console.warn("⚠️ No vendor info found inside 'user'");
        }
      } else {
        console.warn("⚠️ No user data in localStorage");
      }
    } catch (error) {
      console.error("❌ Failed to parse localStorage user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-white border-b shadow-sm px-6 py-3">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <h1 className="font-semibold text-lg text-gray-700">{title}</h1>

      <div className="flex items-center space-x-6">
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full font-bold">
            {loading
              ? "⏳"
              : vendor?.businessName
              ? vendor.businessName.charAt(0).toUpperCase()
              : "?"}
          </div>
          <span className="hidden md:block font-medium text-gray-700">
            {loading
              ? "Loading..."
              : vendor?.businessName || "No Vendor Found"}
          </span>
        </div>
      </div>
    </header>
  );
}
