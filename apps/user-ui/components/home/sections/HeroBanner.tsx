"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Route } from "next";
import { getGreeting, getUserFirstName, getUserInitials } from "@/lib/home";

interface HeroBannerProps {
  user: User | null;
}

export function HeroBanner({ user }: HeroBannerProps) {
  const router = useRouter();
  const firstName = getUserFirstName(user);

  return (
    <section className="relative overflow-hidden bg-[#1a0a00] min-h-[240px] sm:min-h-[280px]">
      {/* Background texture layer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #e85d04 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, #f48c06 0%, transparent 50%)`,
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
            <p className="text-orange-300/80 text-sm font-medium mb-0.5">
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
              <div className="w-11 h-11 rounded-full ring-2 ring-amber-400/60 overflow-hidden bg-amber-900 flex items-center justify-center">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-amber-200 font-bold text-sm">
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
          <Search className="w-5 h-5 text-amber-300/80 shrink-0" />
          <span className="text-white/50 text-sm flex-1">
            Search restaurants or food…
          </span>
          <span className="shrink-0 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-xl">
            Search
          </span>
        </button>

        {/* Location pill */}
        {user?.address?.[0]?.address && (
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
            <p className="text-white/40 text-xs truncate">
              Delivering to{" "}
              <span className="text-white/70 font-medium">
                {user.address[0].address}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
