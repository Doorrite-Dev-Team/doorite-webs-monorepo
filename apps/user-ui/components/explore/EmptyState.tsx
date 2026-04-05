"use client";

import { Package, Search, Store } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface EmptyStateProps {
  hasSearch: boolean;
  searchTerm: string;
  onClear: () => void;
  mode: "products" | "vendors";
  message?: string;
}

export default function EmptyState({
  hasSearch,
  searchTerm,
  onClear,
  mode,
  message,
}: EmptyStateProps) {
  const Icon = mode === "vendors" ? Store : Package;
  const itemType = mode === "vendors" ? "vendors" : "products";

  const isStateMessage = message && message.includes("not yet available");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {isStateMessage ? (
          <Store className="w-8 h-8 text-amber-500" />
        ) : hasSearch ? (
          <Search className="w-8 h-8 text-gray-400" />
        ) : (
          <Icon className="w-8 h-8 text-gray-400" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isStateMessage
          ? "Coming Soon to Your Area"
          : hasSearch
            ? `No ${itemType} found`
            : `No ${itemType} available`}
      </h3>

      <p className="text-gray-500 text-center max-w-md mb-6">
        {isStateMessage ? (
          <span className="text-amber-600 font-medium">{message}</span>
        ) : hasSearch ? (
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

      {hasSearch && !isStateMessage && (
        <Button onClick={onClear} variant="outline">
          Clear Filter
        </Button>
      )}
    </div>
  );
}
