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
      <div className="flex gap-4 items-center">
        <div className="md:hidden">
          <button
            onClick={toggleSidebar}
            className="cursor-pointer"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <h1 className="font-semibold text-lg text-gray-700">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="cursor-pointer relative flex items-center justify-center w-10 h-10 rounded-full bg-background-light dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 transition-colors">
          {/* <span className="material-symbols-outlined">mesasges</span> */}
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#112117]"></span>
        </button>

        <div className="relative cursor-pointer group">
          <div className="w-12 h-12 rounded-full p-0.5 border-2 border-primary/20 group-hover:border-primary">
            <img
              alt="Rider Profile Portrait"
              className="w-full h-full rounded-full object-cover"
              src="/assets/images/profile.png"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-white dark:border-[#1e2923] rounded-full shadow-sm"></div>
        </div>
      </div>
    </header>
  );
}
