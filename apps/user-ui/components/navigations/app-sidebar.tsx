"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Package,
  UserCircle,
  LogOut,
  Layout,
  Star,
  Zap,
  Globe,
  Heart,
  FileText,
  Shield,
  Info,
  Rocket,
} from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";

import { userAtom, logoutAtom, isLoggedInAtom } from "@/store/userAtom";
import { dooriteLogo } from "@repo/ui/assets";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem as NavItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/ui/components/navigation-menu";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Route } from "next";
import { authService } from "@/libs/api-client";
import { useRouter } from "next/navigation";
import { disconnectSocketAtom } from "@/store/socketAtom";

const landingSections = [
  {
    title: "Hero",
    href: "#hero",
    icon: Rocket,
    description: "Back to the top",
  },
  {
    title: "Benefits",
    href: "#benefits",
    icon: Heart,
    description: "Why choose Doorrite",
  },
  {
    title: "Impact",
    href: "#impact",
    icon: Globe,
    description: "Our global footprint",
  },
  {
    title: "How It Works",
    href: "#how-it-works",
    icon: Zap,
    description: "Simple 3-step process",
  },
  {
    title: "Testimonials",
    href: "#testimonials",
    icon: Star,
    description: "What users say",
  },
];

const publicRoutes = [
  { title: "Landing", href: "/landing", icon: Layout, isDropdown: true },
  { title: "About", href: "/about", icon: Info },
  { title: "Privacy", href: "/privacy", icon: Shield },
  { title: "Terms", href: "/terms", icon: FileText },
];

const authRoutes = [
  { title: "Home", href: "/home", icon: Home },
  { title: "Explore", href: "/explore", icon: Search },
  { title: "Orders", href: "/order", icon: Package },
  { title: "Account", href: "/account", icon: UserCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const logout = useSetAtom(logoutAtom);
  const disconect = useSetAtom(disconnectSocketAtom);
  const router = useRouter();

  const signOut = async () => {
    await authService.logout();
    logout();
    disconect();
    router.push("/log-in");
  };

  const navItems = isLoggedIn ? authRoutes : publicRoutes;

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
              <Link href={isLoggedIn ? "/home" : "/landing"}>
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20 text-white">
                  <Image
                    src={dooriteLogo}
                    alt="Logo"
                    width={24}
                    height={24}
                    className="size-5"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-lg tracking-tight">
                    Doorrite
                  </span>
                  <span className="truncate text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                if (
                  !isLoggedIn &&
                  (item as (typeof publicRoutes)[0]).isDropdown
                ) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <NavigationMenu className="max-w-full justify-start">
                        <NavigationMenuList className="flex-col items-start space-x-0">
                          <NavItem className="w-full">
                            <NavigationMenuTrigger
                              className={cn(
                                "w-full justify-start gap-3 bg-transparent hover:bg-gray-100 h-10 px-3",
                                isActive && "bg-primary/5 text-primary",
                              )}
                            >
                              <item.icon className="size-5 shrink-0" />
                              <span className="font-medium">{item.title}</span>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="flex flex-col p-2 min-w-[240px] gap-1 bg-white/95 backdrop-blur-md">
                              {landingSections.map((section) => (
                                <NavigationMenuLink asChild key={section.href}>
                                  <a
                                    href={section.href}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                    <div className="p-2 rounded-md bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                      <section.icon className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-sm font-semibold">
                                        {section.title}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                                        {section.description}
                                      </span>
                                    </div>
                                  </a>
                                </NavigationMenuLink>
                              ))}
                            </NavigationMenuContent>
                          </NavItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-10 px-3 gap-3 transition-all duration-200"
                    >
                      <Link href={item.href as Route}>
                        <item.icon className="size-5 shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-gray-50/50 border border-gray-100">
              <Avatar className="size-9 border-2 border-white shadow-sm">
                <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {user?.fullName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate leading-none mb-1">
                  {user?.fullName}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3 px-3 h-10"
            >
              <LogOut className="size-5" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Button
            className="w-full rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 font-bold tracking-tight"
            asChild
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
