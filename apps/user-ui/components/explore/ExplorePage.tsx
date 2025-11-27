"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounceValue } from "usehooks-ts";
import { parseAsString, parseAsBoolean, useQueryStates } from "nuqs";

// UI Components
import ExploreHeader from "@/components/explore/ExploreHeader";
import SearchBar from "@/components/explore/SearchBar";
import CategoryFilters from "@/components/explore/CategoryFilters";
import FilterControls from "@/components/explore/FilterControls";
import ResultsHeader from "@/components/explore/ResultsHeader";
import VendorCard from "@/components/explore/VendorCard";
import EmptyState from "@/components/explore/EmptyState";
import LoadingSkeleton from "@/components/explore/LoadingSkeleton";

// Constants and API
import { CATEGORIES, SORT_OPTIONS, PRICE_FILTERS } from "@/libs/explore-config";
import { api } from "@/libs/api";

const defaultParams = {
  q: null,
  category: "all",
  sort: "popular",
  price: "all",
  open: false,
};

// ➡️ Define the nuqs configuration map using explicit Param types to satisfy TypeScript
const queryStateMap = {
  // Use withDefault() to set the default state value ('')
  // Use withOptions() to set configuration like 'shallow'
  q: parseAsString.withDefault("").withOptions({ shallow: true }),
  category: parseAsString.withDefault("all").withOptions({ shallow: true }),
  sort: parseAsString.withDefault("popular").withOptions({ shallow: true }),
  price: parseAsString.withDefault("all").withOptions({ shallow: true }),

  // Boolean: Default to false if not present, and clear from URL when false (serialize: null)
  open: parseAsBoolean.withDefault(false),
};

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use nuqs to synchronize state with URL
  const [{ q, category, sort, price, open }, setParams] = useQueryStates(
    queryStateMap,
    {
      history: "replace",
    }
  );

  // Debounce the search term (q) from the URL state
  const [debouncedSearch] = useDebounceValue(q, 300);

  const clearFilters = useCallback(() => {
    // Reset all parameters to default values
    setParams(defaultParams);
    // Clear local products state for immediate visual change
    setProducts([]);
  }, [setParams]);

  // Update the search query (q) in the URL
  const setSearchAction = useCallback(
    (value: string) => {
      setParams({ q: value || null });
    },
    [setParams]
  );

  // Update the category in the URL
  const setCategoryAction = useCallback(
    (value: string) => {
      setParams({ category: value === "all" ? null : value });
    },
    [setParams]
  );

  // Update the sort parameter in the URL
  const setSortByAction = useCallback(
    (value: string) => {
      setParams({ sort: value === "popular" ? null : value });
    },
    [setParams]
  );

  // Update the price filter in the URL
  const setPriceFilterAction = useCallback(
    (value: string) => {
      setParams({ price: value === "all" ? null : value });
    },
    [setParams]
  );

  // Toggle the 'open' status in the URL
  const setShowOpenOnlyAction = useCallback(
    (value: boolean) => {
      setParams({ open: value || null });
    },
    [setParams]
  );

  const fetchProducts = useCallback(async () => {
    // Skip fetch if no filters are active
    if (
      !q &&
      category === "all" &&
      sort === "popular" &&
      price === "all" &&
      !open
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const params: Record<string, string> = {};
      if (debouncedSearch) params.q = debouncedSearch;
      if (category !== "all") params.category = category;
      if (price !== "all") params.price = price;
      if (sort !== "popular") params.sort = sort;

      // Fetch products using the generated API parameters
      const resProducts = await api.fetchProducts(params);

      if (Array.isArray(resProducts)) {
        // Apply client-side filtering for 'open' state
        const finalProducts = open
          ? resProducts.filter((p) => p.isAvailable)
          : resProducts;
        setProducts(finalProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("\u274c Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, debouncedSearch, price, sort, open, q]);

  useEffect(() => {
    // Trigger fetch when debounced search or query state changes
    fetchProducts();
  }, [fetchProducts]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(
    () =>
      q !== "" ||
      category !== "all" ||
      sort !== "popular" ||
      price !== "all" ||
      open,
    [q, category, sort, price, open]
  );

  const filteredProducts = products;

  return (
    // Mobile Overflow Fix: Use flex-col and min-h-screen for proper vertical layout
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Scrollable container with fixed-width content */}
      <div className="w-full md:max-w-4xl mx-auto overflow-hidden px-4 md:px-6 flex-1 pt-6 pb-8">
        {/* Header/Filters Section */}
        <header className="space-y-4 mb-6">
          <ExploreHeader />
          <SearchBar search={q} setSearch={setSearchAction} />
          <CategoryFilters
            categories={CATEGORIES}
            category={category}
            setCategoryAction={setCategoryAction}
          />
          <FilterControls
            sortBy={sort}
            setSortBy={setSortByAction}
            sortOptions={SORT_OPTIONS}
            priceFilter={price}
            setPriceFilter={setPriceFilterAction}
            priceFilters={PRICE_FILTERS}
            showOpenOnly={open}
            setShowOpenOnly={setShowOpenOnlyAction}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </header>

        {/* Results Section */}
        <ResultsHeader
          debouncedSearch={debouncedSearch}
          filteredCount={filteredProducts.length}
          category={category}
          categories={CATEGORIES}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {isLoading ? (
            // Render two skeletons for the 2-column grid
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <VendorCard
                key={product.id}
                vendor={{
                  id: parseInt(product.id),
                  description: product.description,
                  priceRange: `${product.basePrice.toLocaleString()}`,
                  category: category,
                  isOpen: product.isAvailable,
                  logoUrl: product.vendor?.logoUrl,
                  businessName: product.vendor?.businessName,
                }}
              />
            ))
          ) : (
            // EmptyState must span two columns
            <div className="sm:col-span-2">
              <EmptyState
                hasSearch={!!debouncedSearch}
                searchTerm={debouncedSearch}
                onClear={clearFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
