"use client";

import { Badge } from "@repo/ui/components/badge";

export default function ResultsHeader({
  debouncedSearch,
  filteredCount,
  category,
  categories,
  hasActiveFilters,
}: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
      <p className="text-sm text-gray-600">
        {debouncedSearch ? (
          <>
            <span>Results for </span>
            <span className="font-semibold text-primary">
              &quot;{debouncedSearch}&quot;
            </span>
            <span className="ml-2">• {filteredCount} found</span>
          </>
        ) : (
          <>
            <span>
              Showing {filteredCount}{" "}
              {category === "all"
                ? "places"
                : categories.find((c: any) => c.id === category)?.name.toLowerCase()}
            </span>
            {hasActiveFilters && (
              <span className="ml-2 text-primary">• Filtered</span>
            )}
          </>
        )}
      </p>

      <Badge variant="secondary" className="bg-primary/10 text-primary">
        {filteredCount} results
      </Badge>
    </div>
  );
}
