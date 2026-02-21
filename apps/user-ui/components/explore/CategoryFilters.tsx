"use client";

import { Button } from "@repo/ui/components/button";
import { Type } from "lucide-react";

interface CategoryFiltersProps {
  categories: {
    id: string;
    name: string;
    icon: typeof Type;
  }[];
  category: string;
  setCategoryAction: (id: string) => void;
}

export default function CategoryFilters({
  categories,
  category,
  setCategoryAction,
}: CategoryFiltersProps) {
  return (
    <div className="mb-6 w-full">
      <div className="w-full max-w-[300px] flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {categories.map((cat) => {
          const isActive = category === cat.id;
          const Icon = cat.icon;

          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => setCategoryAction(cat.id)}
              className={`flex items-center gap-2 h-10 shrink-0 px-4 whitespace-nowrap ${
                isActive ? "bg-primary text-white" : "bg-white hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
