"use client";
// components/explore/SearchBar.tsx
import { Search, X } from "lucide-react";
import { Input } from "@repo/ui/components/input";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  search,
  setSearch,
  placeholder,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder || "Search products, vendors..."}
        className="pl-10 pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-primary shadow-sm"
        leftIcon={<Search size={20} />}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
