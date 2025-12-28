"use client";

import { Menu } from "lucide-react";
// import { useEffect, useState } from "react";
import NotificationPanel from "../notification";
import { useAtom } from "jotai";
import { vendorAtom } from "@/store/vendorAtom";

interface TopbarProps {
  toggleSidebar: () => void;
  title?: string;
}

export default function Topbar({
  toggleSidebar,
  title = "Dashboard",
}: TopbarProps) {
  // const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendor] = useAtom(vendorAtom);
  // const [loading, setLoading] = useState(true);

  return (
    <header className="flex justify-between items-center bg-white border-b shadow-sm px-4 sm:px-6 py-3">
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="font-semibold text-lg text-gray-700">{title}</h1>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        <NotificationPanel />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full font-bold text-sm">
            {vendor?.businessName
              ? vendor.businessName.charAt(0).toUpperCase()
              : "G"}
          </div>
          <span className="hidden sm:block font-medium text-gray-700 max-w-[150px] truncate">
            {vendor?.businessName || "Vendor"}
          </span>
        </div>
      </div>
    </header>
  );
}
