"use client";

import { Button } from "@repo/ui/components/button";

export default function CategoryFilters({
  categories,
  category,
  setCategory,
}: {
  categories: { id: string; name: string; icon: any }[];
  category: string;
  setCategory: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isActive = category === cat.id;
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 whitespace-nowrap h-10 ${
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
