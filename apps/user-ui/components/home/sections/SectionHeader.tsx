"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Route } from "next";

interface SectionHeaderProps {
  title: string;
  href: string;
  label?: string;
}

export function SectionHeader({
  title,
  href,
  label = "See all",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6">
      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h2>
      <Link
        href={href as Route}
        className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
      >
        {label}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
