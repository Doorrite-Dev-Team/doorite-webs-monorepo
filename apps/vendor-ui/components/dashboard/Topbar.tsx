"use client";

import { Bell, Menu } from "lucide-react";

interface TopbarProps {
  toggleSidebar: () => void;
  title?: string;
}

export default function Topbar({
  toggleSidebar,
  title = "Dashboard",
}: TopbarProps) {
  return (
    <header className="flex justify-between items-center bg-white border-b shadow-sm px-6 py-3">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          // className="p-2 bg-green-600 text-white rounded-md"
        >
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
            OD
          </div>
          <span className="hidden md:block font-medium text-gray-700">
            Olarewaju Damilare
          </span>
        </div>
      </div>
    </header>
  );
}
