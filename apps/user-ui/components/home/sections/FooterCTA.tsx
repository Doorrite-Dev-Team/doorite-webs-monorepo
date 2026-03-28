"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Route } from "next";

export function FooterCTA() {
  return (
    <div className="px-4 sm:px-6">
      <Link href={"/explore" as Route}>
        <Button
          className={cn(
            "w-full h-13 rounded-2xl",
            "bg-gray-900 hover:bg-gray-800 text-white",
            "text-base font-bold tracking-tight",
            "shadow-lg shadow-gray-900/20",
            "flex items-center justify-center gap-2",
          )}
        >
          <Search className="w-4 h-4" />
          Explore all restaurants
        </Button>
      </Link>
    </div>
  );
}
