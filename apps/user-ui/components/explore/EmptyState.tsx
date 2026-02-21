"use client";

// components/explore/EmptyState.tsx
import { Package, Search, Store } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface EmptyStateProps {
  hasSearch: boolean;
  searchTerm: string;
  onClear: () => void;
  mode: "products" | "vendors";
}

export default function EmptyState({
  hasSearch,
  searchTerm,
  onClear,
  mode,
}: EmptyStateProps) {
  const Icon = mode === "vendors" ? Store : Package;
  const itemType = mode === "vendors" ? "vendors" : "products";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {hasSearch ? (
          <Search className="w-8 h-8 text-gray-400" />
        ) : (
          <Icon className="w-8 h-8 text-gray-400" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearch ? `No ${itemType} found` : `No ${itemType} available`}
      </h3>

      <p className="text-gray-500 text-center max-w-md mb-6">
        {hasSearch ? (
          <>
            We couldn&apos;t find any {itemType} matching{" "}
            <q>
              <span className="font-medium">{searchTerm}</span>
            </q>
            . Try adjusting your search or filters.
          </>
        ) : (
          `There are no ${itemType} available at the moment. Please check back later.`
        )}
      </p>

      {hasSearch && (
        <Button onClick={onClear} variant="outline">
          Clear Filter
        </Button>
      )}
    </div>
  );
}
