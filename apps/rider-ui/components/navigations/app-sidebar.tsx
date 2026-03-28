"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Route } from "next";
import {
  Home,
  Truck,
  MapPin,
  DollarSign,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { riderAtom, logOutRiderAtom } from "@/store/riderAtom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { disconnectSocketAtom } from "@/store/socketAtom";
import { authService } from "@/libs/api-client";
import { useRouter } from "next/navigation";
import { dooriteLogo } from "@repo/ui/assets";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Deliveries", href: "/deliveries", icon: Truck },
  { title: "Map", href: "/map", icon: MapPin },
  { title: "Earnings", href: "/earnings", icon: DollarSign },
  { title: "Account", href: "/account", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [rider] = useAtom(riderAtom);
  const logout = useSetAtom(logOutRiderAtom);
  const disconnect = useSetAtom(disconnectSocketAtom);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    logout();
    disconnect();
    router.push("/login");
    window.location.href = "/login";
  };

  const getInitials = (name?: string) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-100">
      <SidebarHeader className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-green-600 text-white">
                  <Image
                    src={dooriteLogo}
                    alt="Logo"
                    width={24}
                    height={24}
                    className="size-5 invert"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-lg tracking-tight">
                    Doorrite
                  </span>
                  <span className="truncate text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Rider
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="h-10 px-3 gap-3 transition-all duration-200"
                >
                  <Link href={item.href as Route<string>}>
                    <Icon className="size-5 shrink-0" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-gray-50/50 border border-gray-100">
            <Avatar className="size-9 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-green-600 text-white text-xs">
                {getInitials(rider?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate leading-none mb-1">
                {rider?.name || "Rider"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {rider?.email || "rider@example.com"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3 px-3 h-10"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
