// src/components/explore/QuickFilters.tsx
"use client";

import { Button } from "@repo/ui/components/button";

interface QuickFiltersProps {
  open: boolean;
  topRated: boolean;
  onToggle: (filterId: "open" | "top_rated") => void;
}

const QUICK_FILTERS = [
  { id: "open" as const, label: "Open Now", icon: "🟢" },
  { id: "top_rated" as const, label: "Top Rated", icon: "⭐" },
];

export default function QuickFilters({
  open,
  topRated,
  onToggle,
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map((filter) => {
        const isActive = filter.id === "open" ? open : topRated;
        return (
          <Button
            key={filter.id}
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            onClick={() => onToggle(filter.id)}
            className="text-sm h-10 min-h-[44px]"
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
