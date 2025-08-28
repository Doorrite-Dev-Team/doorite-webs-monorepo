"use client";

import { cn } from "@repo/ui/lib/utils";
import { Home, Package, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface TabItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  activeIcon?: React.ReactNode;
}

const TabNavigation: React.FC = () => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      name: "Home",
      icon: <Home size={22} strokeWidth={pathname === "/home" ? 2.5 : 2} />,
      href: "/home",
    },
    {
      name: "Explore",
      icon: (
        <Search size={22} strokeWidth={pathname === "/explore" ? 2.5 : 2} />
      ),
      href: "/explore",
    },
    {
      name: "Orders",
      icon: (
        <Package size={22} strokeWidth={pathname === "/orders" ? 2.5 : 2} />
      ),
      href: "/orders",
    },
    {
      name: "Account",
      icon: <User size={22} strokeWidth={pathname === "/account" ? 2.5 : 2} />,
      href: "/account",
    },
  ];

  return (
    <>
      {/* Bottom spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 sm:h-0" />

      <footer className="fixed bottom-4 left-0 right-0 bg-white/50 mx-5 backdrop-blur-md shadow-lg border-t border-primary/10 z-50 rounded-lg">
        <nav className="flex justify-around items-center px-2 py-3 max-w-md mx-auto">
          {tabs.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ease-in-out relative min-w-0 flex-1",
                  {
                    "text-primary scale-105": isActive,
                    "text-gray-500 hover:text-primary/70": !isActive,
                  }
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}

                {/* Icon container */}
                <div
                  className={cn(
                    "flex items-center justify-center transition-all duration-200",
                    {
                      "bg-primary/15 p-2 rounded-lg": isActive,
                      "p-1": !isActive,
                    }
                  )}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-xs font-medium transition-all duration-200 truncate",
                    {
                      "text-primary font-semibold": isActive,
                      "text-gray-500": !isActive,
                    }
                  )}
                >
                  {item.name}
                </span>

                {/* Subtle glow effect for active tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white/95" />
      </footer>
    </>
  );
};

export default TabNavigation;
