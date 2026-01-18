"use client";

import { User, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";

import { isLoggedInAtom, userAtom, logoutAtom } from "@/store/userAtom";
import CartDrawer from "../cart/cart";
import NotificationPanel from "../global/notification";
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
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { disconnectSocketAtom } from "@/store/socketAtom";
import { authService } from "@/libs/api-client";

const Header = () => {
  // const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [user] = useAtom(userAtom);
  const logout = useSetAtom(logoutAtom);
  const disconect = useSetAtom(disconnectSocketAtom);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await authService.logout();
    logout();
    disconect();
    router.push("/log-in");
  };

  // Check if we're on a public page
  // const isPublicPage = ["/landing", "/about", "/privacy", "/terms"].includes(
  //   pathname,
  // );

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <nav className="flex items-center justify-between h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Sidebar Toggle - Only show on authenticated pages */}

          <div className={cn(isLoggedIn && "max-sm:hidden")}>
            <SidebarTrigger />
          </div>

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

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <NotificationPanel />
              <CartDrawer />

              {/* User Menu - Desktop */}
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={user?.profileImageUrl}
                          alt={user?.fullName}
                        />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {getInitials(user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
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
                        <Package className="w-4 h-4 mr-2" />
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
              </div>
            </>
          ) : (
            // Guest User Buttons
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/log-in">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
