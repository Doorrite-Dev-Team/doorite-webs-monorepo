// app/(home)/explore/_components/CuisineFilters.tsx

"use client";

import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";

const CUISINES = [
  { id: "all", label: "All", icon: "🍽️" },
  { id: "nigerian", label: "Nigerian", icon: "🍛" },
  { id: "fastfood", label: "Fast Food", icon: "🍔" },
  { id: "continental", label: "Continental", icon: "🍝" },
  { id: "chinese", label: "Chinese", icon: "🥡" },
  { id: "shawarma", label: "Shawarma & Grills", icon: "🌯" },
  { id: "breakfast", label: "Breakfast", icon: "🥞" },
  { id: "pastries", label: "Bakery", icon: "🍰" },
  { id: "drinks", label: "Drinks", icon: "🥤" },
  { id: "healthy", label: "Healthy", icon: "🥗" },
  { id: "seafood", label: "Seafood", icon: "🦐" },
] as const;

interface CuisineFiltersProps {
  selected: string;
  onChange: (cuisine: string) => void;
}

export default function CuisineFilters({
  selected,
  onChange,
}: CuisineFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {CUISINES.map((cuisine) => (
          <Badge
            key={cuisine.id}
            variant={selected === cuisine.id ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
            onClick={() => onChange(cuisine.id)}
          >
            <span className="mr-1">{cuisine.icon}</span>
            {cuisine.label}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
