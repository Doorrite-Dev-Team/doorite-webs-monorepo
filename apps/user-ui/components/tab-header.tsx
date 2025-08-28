"use client";

import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

// Import your CartDrawer here — make sure ./cart exports default CartDrawer
import { humanizePath } from "../libs/helper";
import CartDrawer from "./cart";
import NotificationPanel from "./notification";

// --------------------- Header ---------------------
const Header: React.FC = () => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const isTopLevel = ["/", "", "/home", "/landing"].includes(pathname);
  const isTabRoute = ["/home", "/explore", "/orders", "/account"].includes(
    pathname
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
        <nav className="flex items-center justify-between p-4 max-w-lg mx-auto">
          {/* Left */}
          <div className="flex items-center min-w-0 flex-1">
            {isTabRoute || isTopLevel ? (
              <Link href="/home" className="flex items-center gap-3 min-w-0">
                <Image
                  src="/icon.jpg"
                  alt="Doorrite Logo"
                  width={28}
                  height={28}
                  className="rounded-sm"
                  priority
                />
                <div className="hidden sm:block min-w-0">
                  <p className="font-bold text-lg text-primary truncate">
                    Doorrite
                  </p>
                </div>
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-primary/10 rounded-full mr-2 bg-transparent border-none cursor-pointer transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          {/* Center */}
          <div className="flex-1 text-center px-2">
            <h1 className="font-bold text-lg text-primary truncate">{title}</h1>
            {isTopLevel && (
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>Lagos, NG</span>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 flex-1 justify-end">
            {(isTabRoute || isTopLevel) && (
              <>
                <NotificationPanel />

                {/* Use the shadcn Drawer + your imported CartDrawer */}
                <CartDrawer />
              </>
            )}
          </div>
        </nav>
      </header>

      {/* spacer so page content isn't hidden by fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;
