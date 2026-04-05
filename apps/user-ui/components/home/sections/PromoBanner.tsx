"use client";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Route } from "next";

export function PromoBanner() {
  return (
    <div className="px-4 sm:px-6">
      <Link
        href={"/explore?top_rated=true" as Route}
        className={cn(
          "flex items-center justify-between",
          "bg-gradient-to-r from-green-600 to-green-700",
          "rounded-2xl px-5 py-4 shadow-md shadow-green-200/60",
          "hover:shadow-lg hover:shadow-green-200/80 active:scale-[0.98]",
          "transition-all duration-200 touch-manipulation",
        )}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              Top Rated Today
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-tight">
            Best restaurants
            <br />
            near you
          </p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </Link>
    </div>
  );
}
