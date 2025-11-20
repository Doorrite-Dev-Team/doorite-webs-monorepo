"use client";

import { cn } from "@repo/ui/lib/utils";
import { Home, Package, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Route } from "next";

interface TabItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface TabNavigationProps {
  onNavigate?: () => void; // 👈 callback for closing sidebar
}

const TabNavigation: React.FC<TabNavigationProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { name: "Home", icon: <Home size={20} />, href: "/home" },
    { name: "Explore", icon: <Search size={20} />, href: "/explore" },
    { name: "Orders", icon: <Package size={20} />, href: "/orders" },
    { name: "Account", icon: <User size={20} />, href: "/account" },
  ];

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-100 z-50">
      <nav className="flex flex-col items-start px-4 py-6 space-y-2">
        {tabs.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href as Route<string>}
              onClick={onNavigate} // 👈 close sidebar when clicked
              className={cn(
                "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition",
                {
                  "bg-green-100 text-green-700": isActive,
                  "text-green-600 hover:text-green-800": !isActive,
                }
              )}
            >
              {/* Icon */}
              <div className="flex items-center justify-center">
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={cn("text-sm font-medium truncate", {
                  "text-green-700 font-semibold": isActive,
                  "text-green-600": !isActive,
                })}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default TabNavigation;
