"use client";

import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { CUISINE_CATEGORIES } from "@/constants/categories";

export function CategoryPills() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-6 -mx-0 py-1">
      {CUISINE_CATEGORIES.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm",
            "text-sm font-medium text-gray-700 whitespace-nowrap",
            "hover:border-green-400 hover:bg-green-50 hover:text-green-800",
            "active:scale-95 transition-all duration-150 touch-manipulation",
          )}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
