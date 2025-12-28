"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  ListOrdered,
  Menu,
  DollarSign,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/public/assets/icons";
import { Route } from "next";
import { useSetAtom } from "jotai";
import { logOutVendorAtom } from "@/store/vendorAtom";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Orders", icon: ListOrdered, href: "/orders" },
  { name: "Menu", icon: Menu, href: "/menu" },
  { name: "Earnings", icon: DollarSign, href: "/earnings" },
  { name: "Account", icon: User, href: "/account" },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const logOutVendor = useSetAtom(logOutVendorAtom);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/log-out", { method: "POST" });

      logOutVendor();
      router.push("/log-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center gap-2">
          <Logo className="w-7 h-7 text-green-600" />
          <span className="font-bold text-xl text-green-700">Doorrite</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href as Route<string>}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
