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
  onNavigate?: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { name: "Home", icon: <Home size={20} />, href: "/home" },
    { name: "Explore", icon: <Search size={20} />, href: "/explore" },
    { name: "Orders", icon: <Package size={20} />, href: "/order" },
    { name: "Account", icon: <User size={20} />, href: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 sm:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href as Route<string>}
              onClick={onNavigate}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px]",
                {
                  "bg-primary/10 text-primary": isActive,
                  "text-gray-600 hover:text-primary hover:bg-gray-50":
                    !isActive,
                },
              )}
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <span
                className={cn("text-xs font-medium", {
                  "font-semibold": isActive,
                })}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
