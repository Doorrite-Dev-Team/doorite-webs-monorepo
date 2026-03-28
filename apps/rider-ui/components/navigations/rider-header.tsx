"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import { Route } from "next";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@repo/ui/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Button } from "@repo/ui/components/button";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { riderAtom, logOutRiderAtom } from "@/store/riderAtom";
import { disconnectSocketAtom } from "@/store/socketAtom";
import { authService } from "@/libs/api-client";
import { dooriteLogo } from "@repo/ui/assets";
import NotificationPanel from "@/components/global/notification";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [rider] = useAtom(riderAtom);
  const logout = useSetAtom(logOutRiderAtom);
  const disconnect = useSetAtom(disconnectSocketAtom);

  const getInitials = (name?: string) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    disconnect();
    router.push("/login");
    window.location.href = "/login";
  };

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Home", path: "/" }];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      if (name !== "Home") {
        breadcrumbs.push({ name, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <nav className="flex items-center justify-between h-16 w-full px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SidebarTrigger />

          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <Image
              src={dooriteLogo}
              alt="Doorrite"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="font-bold sm:hidden text-xl text-green-600">
              Rider
            </span>
          </Link>

          <div className="hidden lg:block">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="font-semibold">
                          {crumb.name}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.path as Route<string>}>
                            {crumb.name}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationPanel />

          {/* User Menu - Desktop */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {getInitials(rider?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {rider?.name?.split(" ")[0] || "Rider"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {rider?.name || "Rider"}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {rider?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
