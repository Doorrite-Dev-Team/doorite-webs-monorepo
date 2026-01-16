interface ResultsHeaderProps {
  debouncedSearch: string;
  filteredCount: number;
  totalCount?: number;
  category: string;
  categories: Array<{ value: string; label: string }>;
  hasActiveFilters: boolean;
  mode: "products" | "vendors";
}

export default function ResultsHeader({
  debouncedSearch,
  filteredCount,
  totalCount,
  category,
  hasActiveFilters,
  mode,
}: ResultsHeaderProps) {
  const itemType = mode === "vendors" ? "vendor" : "product";
  const itemsType = mode === "vendors" ? "vendors" : "products";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {debouncedSearch ? (
            <>
              Results for{" "}
              <q>
                <span className="text-primary">{debouncedSearch}</span>
              </q>
            </>
          ) : category !== "all" ? (
            <span className="capitalize">{category}</span>
          ) : (
            `All ${itemsType}`
          )}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {filteredCount} {filteredCount === 1 ? itemType : itemsType} found
          {totalCount && totalCount > filteredCount && ` (${totalCount} total)`}
          {hasActiveFilters && " with active filters"}
        </p>
      </div>
    </div>
  );
}
