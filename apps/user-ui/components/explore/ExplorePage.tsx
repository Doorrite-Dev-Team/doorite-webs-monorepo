"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { parseAsString, parseAsBoolean, useQueryStates } from "nuqs";
import { api } from "@/libs/api";
import ProductCard from "@/components/ProductCard";
import LoadingSkeleton from "@/components/explore/LoadingSkeleton";
import EmptyState from "@/components/explore/EmptyState";
import FilterControls from "@/components/explore/FilterControls";
import { SORT_OPTIONS, PRICE_FILTERS } from "@/libs/explore-config";

const productParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault("all"),
  sort: parseAsString.withDefault("popular"),
  price: parseAsString.withDefault("all"),
  open: parseAsBoolean.withDefault(false),
};

export default function ExplorePage() {
  // 1. URL State Management
  const [{ q, category, sort, price, open }, setParams] = useQueryStates(
    productParsers,
    { history: "replace", shallow: false },
  );

  // 2. Debounce Search to prevent API spam
  const [debouncedQ] = useDebounceValue(q, 500);

  const params: Record<string, string> = {};
  if (debouncedQ) params.q = debouncedQ;
  if (category !== "all") params.category = category;
  if (price !== "all") params.price = price;
  if (sort !== "popular") params.sort = sort;
  if (open) params.open = "true";

  const queryString = new URLSearchParams(params).toString();

  // 3. React Query Data Fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { q: debouncedQ, category, sort, price, open }],
    queryFn: () => api.fetchProducts(queryString),
    placeholderData: (prev) => prev, // Keep previous data while fetching new filters
  });

  const products = data?.products || [];
  const total = data?.pagination?.total || 0;
  const hasActiveFilters =
    q !== "" ||
    category !== "all" ||
    sort !== "popular" ||
    price !== "all" ||
    open;

  // 4. Handlers
  const clearFilters = () =>
    setParams({
      q: "",
      category: "all",
      sort: "popular",
      price: "all",
      open: false,
    });

  return (
    <div className="space-y-6">
      {/* Product Specific Controls */}
      <FilterControls
        sortBy={sort}
        setSortByAction={(val) => setParams({ sort: val })}
        sortOptions={SORT_OPTIONS}
        priceFilter={price}
        setPriceFilterAction={(val) => setParams({ price: val })}
        priceFilters={PRICE_FILTERS}
        showOpenOnly={open}
        setShowOpenOnly={(val) => setParams({ open: val })}
        clearFiltersAction={clearFilters}
        hasActiveFilters={hasActiveFilters}
        mode="products"
      />

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
        ) : isError ? (
          <div className="col-span-full text-center text-red-500">
            Failed to load products
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              mode="products"
              hasSearch={!!q}
              searchTerm={q}
              onClear={clearFilters}
            />
          </div>
        )}
      </div>

      {/* Footer / Pagination Hint */}
      {!isLoading && products.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Showing {products.length} of {total} products
        </p>
      )}
    </div>
  );
}
