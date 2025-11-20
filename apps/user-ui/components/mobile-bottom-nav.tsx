"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Route } from "next";
import { Home, Search, Package, User, LucideProps } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface TabItem {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  href: Route<string>;
}

const tabs: TabItem[] = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Explore", icon: Search, href: "/explore" },
  { name: "Orders", icon: Package, href: "/orders" },
  { name: "Account", icon: User, href: "/account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        w-[90%] max-w-lg
        rounded-3xl
        border border-white/20
        bg-white/10
        backdrop-blur-xl
        shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        md:hidden z-50
      "
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="
                flex flex-col items-center justify-center text-black
                w-full py-2
                transition-all duration-300
                active:scale-90
              "
            >
              <div
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  isActive ? "text-blue-600 scale-110" : "text-black"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive
                      ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      : "text-black"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] mt-1 transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-70 text-black"
                  )}
                >
                  {item.name}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
