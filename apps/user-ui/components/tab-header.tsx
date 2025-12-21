"use client";

import { ArrowLeft, MapPin, Menu } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

import { humanizePath } from "../libs/helper";
import CartDrawer from "./cart/cart";
import NotificationPanel from "./notification";
import TabNavigation from "./tab-navication"; // 👈 The sidebar component
import { Button } from "@repo/ui/components/button";
import { useAtom } from "jotai";
import { isLoggedInAtom, userAtom } from "@/store/userAtom";
import Image from "next/image";
import { dooriteLogo } from "@repo/ui/assets";

// --------------------- Header ---------------------
const Header = () => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 control sidebar
  // const userName = useUser();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [user] = useAtom(userAtom);

  const isTopLevel = ["/", "", "/home", "/landing"].includes(pathname);
  const isTabRoute = ["/home", "/explore", "/order", "/account"].includes(
    pathname,
  );

  const getTitle = () => {
    if (pathname === "/explore") return "Explore";
    if (isTopLevel) return "Doorrite";
    return humanizePath(pathname);
  };

  const title = getTitle();

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/home");
    }
  }, [router]);

  return (
    <>
      <header className="bg-white/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-[900] border-b border-primary/10">
        <nav className="grid grid-cols-3 items-center p-4 w-full max-w-full mx-auto px-4 sm:px-6 md:px-16">
          {/* Left */}
          <div className="flex items-center">
            {/* 👇 Mobile menu button */}
            {isLoggedIn ? (
              <div className="max-md:hidden mr-4 cursor-pointer flex items-center justify-center">
                <button
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            ) : (
              <div>
                <Image
                  src={dooriteLogo}
                  alt="Doorrite Logo"
                  width={40}
                  height={30}
                />
              </div>
            )}

            {isTabRoute || isTopLevel ? (
              <Link href="/home" className="flex items-center gap-3">
                {/*<Image
                  src="/logo.ico"
                  alt="Doorrite Logo"
                  width={28}
                  height={28}
                  className="rounded-sm"
                  priority
                />*/}
                <div className="hidden sm:block">
                  <p className="font-bold text-lg text-primary truncate">
                    Doorrite
                  </p>
                </div>
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-primary/10 rounded-full bg-transparent border-none cursor-pointer transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          {/* Center */}
          <div className="flex flex-col items-center text-center overflow-hidden">
            <h1 className="font-bold text-lg text-primary truncate">{title}</h1>
            {isTopLevel && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                <MapPin size={12} />
                <span className="truncate">
                  {user?.address?.[0]?.address ?? "Lagos, NG"}
                </span>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-1">
            {(isTabRoute || isTopLevel) &&
              (isLoggedIn ? (
                <>
                  <NotificationPanel />
                  <CartDrawer />
                </>
              ) : (
                <div className="flex items-center justify-center gap-5">
                  <Button asChild>
                    <Link href="/log-in">Log In</Link>
                  </Button>
                  <Button className="max-md:hidden" asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              ))}
          </div>
        </nav>
      </header>

      {/* spacer so page content isn't hidden by fixed header */}
      <div className="h-16" />

      {/* ---------------- Mobile Sidebar ---------------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] max-md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <TabNavigation onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
