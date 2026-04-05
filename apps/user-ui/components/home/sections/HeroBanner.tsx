"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, Plus } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Route } from "next";
import { getGreeting, getUserFirstName, getUserInitials } from "@/libs/home";

interface HeroBannerProps {
  user: User | null;
  userCoords?: { lat: number; long: number } | null;
  sessionAddress?: string | null;
  onRequestLocation?: () => void;
  onAddAddress?: () => void;
  addresses?: Address[];
  selectedAddress?: string;
  onSelectAddress?: (address: Address) => void;
}

export function HeroBanner({
  user,
  userCoords,
  sessionAddress,
  onRequestLocation,
  onAddAddress,
  addresses,
  selectedAddress,
  onSelectAddress,
}: HeroBannerProps) {
  const router = useRouter();
  const firstName = getUserFirstName(user);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[var(--hero-bg)] min-h-[240px] sm:min-h-[280px]">
      {/* Background texture layer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, var(--hero-accent-1) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, var(--hero-accent-2) 0%, transparent 50%)`,
        }}
      />

      {/* Floating food emoji decorations — purely visual */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        <span className="absolute top-6 right-8 text-4xl opacity-20 rotate-12 hidden sm:block">
          🍔
        </span>
        <span className="absolute bottom-10 right-20 text-3xl opacity-15 -rotate-6 hidden sm:block">
          🌯
        </span>
        <span className="absolute top-16 right-32 text-2xl opacity-10 rotate-45 hidden lg:block">
          🍜
        </span>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-8 pb-6">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-green-300/80 text-sm font-medium mb-0.5">
              {getGreeting()} 👋
            </p>
            <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
              {firstName === "there" ? "What are you" : `${firstName}, hungry`}
              <br />
              <span className="text-amber-400">
                {firstName === "there" ? "craving today?" : "for something?"}
              </span>
            </h1>
          </div>

          {/* Avatar */}
          {user && (
            <Link href={"/account" as Route} className="shrink-0">
              <div className="w-11 h-11 rounded-full ring-2 ring-green-400/60 overflow-hidden bg-green-900 flex items-center justify-center">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-green-200 font-bold text-sm">
                    {getUserInitials(user.fullName)}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>

        {/* Search bar — tappable, routes to /explore */}
        <button
          onClick={() => router.push("/explore")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3.5",
            "bg-white/10 hover:bg-white/15 active:bg-white/20",
            "backdrop-blur-sm rounded-2xl border border-white/15",
            "transition-all duration-150 touch-manipulation",
            "text-left",
          )}
        >
          <Search className="w-5 h-5 text-green-300/80 shrink-0" />
          <span className="text-white/50 text-sm flex-1">
            Search restaurants or food…
          </span>
          <span className="shrink-0 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-xl">
            Search
          </span>
        </button>

        {/* Location pill - always show dropdown when addresses.length > 1 */}
        {/* Priority: addresses dropdown > user.address[0] > add address button > guest location */}
        {addresses && addresses.length > 1 ? (
          <div className="relative mt-3">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 px-1 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
              <p className="text-white/40 text-xs truncate">
                Delivering to{" "}
                <span className="text-white/70 font-medium">
                  {selectedAddress ||
                    sessionAddress ||
                    addresses[0]?.address ||
                    "Select address"}
                </span>
              </p>
              <ChevronDown className="w-3 h-3 text-green-400/70 shrink-0" />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a0a00] border border-green-500/30 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {addresses.map((addr, idx) => {
                  const displayAddr =
                    addr.address ||
                    `${addr.state || ""}, ${addr.country || ""}`.trim();
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectAddress?.(addr);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-green-100 hover:bg-green-900/50 border-b border-green-800/30 last:border-b-0"
                    >
                      {displayAddr}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    onAddAddress?.();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-green-400 hover:bg-green-900/50 flex items-center gap-1 border-t border-green-800/30"
                >
                  <Plus className="w-3 h-3" />
                  Add new address
                </button>
              </div>
            )}
          </div>
        ) : sessionAddress || selectedAddress ? (
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
            <p className="text-white/40 text-xs truncate">
              Delivering to{" "}
              <span className="text-white/70 font-medium">
                {sessionAddress || selectedAddress}
              </span>
            </p>
          </div>
        ) : user?.address?.[0]?.address ? (
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
            <p className="text-white/40 text-xs truncate">
              Delivering to{" "}
              <span className="text-white/70 font-medium">
                {user.address[0].address}
              </span>
            </p>
          </div>
        ) : userCoords ? (
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
            <p className="text-white/40 text-xs truncate">
              Delivering to your location
            </p>
          </div>
        ) : user ? (
          <button
            onClick={onAddAddress}
            className="flex items-center gap-1.5 mt-3 px-1 hover:opacity-80 transition-opacity"
          >
            <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
            <p className="text-green-300/80 text-xs truncate">
              Add delivery address
            </p>
            <ChevronDown className="w-3 h-3 text-green-400/70 shrink-0" />
          </button>
        ) : (
          <button
            onClick={onRequestLocation}
            className="flex items-center gap-1.5 mt-3 px-1 hover:opacity-80 transition-opacity"
          >
            <MapPin className="w-3.5 h-3.5 text-green-400/70 shrink-0" />
            <p className="text-green-300/80 text-xs truncate">
              Set your location
            </p>
            <ChevronDown className="w-3 h-3 text-green-400/70 shrink-0" />
          </button>
        )}
      </div>
    </section>
  );
}
