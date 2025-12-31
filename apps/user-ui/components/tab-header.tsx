"use client";

import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";

import { isLoggedInAtom, userAtom, logoutAtom } from "@/store/userAtom";
// import { humanizePath } from "../libs/helper";
import CartDrawer from "./cart/cart";
import NotificationPanel from "./notification";
import TabNavigation from "./tab-navication";
import { Button } from "@repo/ui/components/button";
import { dooriteLogo } from "@repo/ui/assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

const Header = () => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [user] = useAtom(userAtom);
  const [, logout] = useAtom(logoutAtom);

  const isTopLevel = ["/", "", "/home", "/landing"].includes(pathname);
  const isTabRoute = ["/home", "/explore", "/order", "/account"].includes(
    pathname,
  );

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push("/log-in");
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 fixed top-0 left-0 right-0 z-[900] shadow-sm">
        <nav className="flex items-center justify-between h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Sidebar Toggle */}
            {isLoggedIn && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:flex hidden items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Logo */}
            <Link
              href={isLoggedIn ? "/home" : "/landing"}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Image
                src={dooriteLogo}
                alt="Doorrite"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
              <span className="font-bold text-lg sm:text-xl text-primary">
                Doorrite
              </span>
            </Link>
          </div>

          {/* Right Section - Auth & Actions */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                <NotificationPanel />
                <CartDrawer />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
                        <AvatarImage
                          src={user?.profileImageUrl}
                          alt={user?.fullName}
                        />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {getInitials(user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                        {user?.fullName?.split(" ")[0] || "User"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {user?.fullName || "User"}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/order" className="cursor-pointer">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Guest User Buttons
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/log-in">Log In</Link>
                </Button>
                <Button size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Sidebar Overlay & Panel */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl overflow-y-auto transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.profileImageUrl}
                    alt={user?.fullName}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {user?.fullName || "User"}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[180px]">
                    {user?.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <div className="p-4">
              <TabNavigation onNavigate={() => setSidebarOpen(false)} />
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
