"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";

import { VENDORS, vendor } from "@/libs/contant";
import ExploreHeader from "@/components/explore/ExploreHeader";
import SearchBar from "@/components/explore/SearchBar";
import CategoryFilters from "@/components/explore/CategoryFilters";
import FilterControls from "@/components/explore/FilterControls";
import ResultsHeader from "@/components/explore/ResultsHeader";
import VendorCard from "@/components/explore/VendorCard";
import EmptyState from "@/components/explore/EmptyState";
import LoadingSkeleton from "@/components/explore/LoadingSkeleton";

// constants (categories, sort options, price filters)
import { CATEGORIES, SORT_OPTIONS, PRICE_FILTERS } from "@/libs/explore-config";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [priceFilter, setPriceFilter] = useState(
    searchParams.get("price") || "all"
  );
  const [showOpenOnly, setShowOpenOnly] = useState(
    searchParams.get("open") === "true"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch] = useDebounceValue(search, 300);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "all") params.set("category", category);
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (showOpenOnly) params.set("open", "true");
    router.replace(
      `/explore${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      }
    );
  }, [router, search, category, sortBy, priceFilter, showOpenOnly]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("popular");
    setPriceFilter("all");
    setShowOpenOnly(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    let items = [...(Array.isArray(VENDORS) ? VENDORS : [])] as vendor[];
    if (category !== "all")
      items = items.filter((v) => v.category === category);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (v) =>
          (v.name || "").toLowerCase().includes(q) ||
          (v.description || "").toLowerCase().includes(q) ||
          (v.subcategory || "").toLowerCase().includes(q) ||
          (v.tags || []).some((tag) => (tag || "").toLowerCase().includes(q))
      );
    }
    if (priceFilter !== "all")
      items = items.filter((v) => v.priceRange === priceFilter);
    if (showOpenOnly) items = items.filter((v) => v.isOpen);
    // sort
    return items;
  }, [category, debouncedSearch, priceFilter, showOpenOnly]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, [category, debouncedSearch, sortBy, priceFilter, showOpenOnly]);

  const hasActiveFilters =
    category !== "all" ||
    priceFilter !== "all" ||
    showOpenOnly ||
    !!debouncedSearch;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 pt-6 pb-8">
        <ExploreHeader />
        <SearchBar search={search} setSearch={setSearch} />
        <CategoryFilters
          categories={CATEGORIES}
          category={category}
          setCategoryAction={setCategory}
        />
        <FilterControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={SORT_OPTIONS}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          priceFilters={PRICE_FILTERS}
          showOpenOnly={showOpenOnly}
          setShowOpenOnly={setShowOpenOnly}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <ResultsHeader
          debouncedSearch={debouncedSearch}
          filteredCount={filteredAndSortedItems.length}
          category={category}
          categories={CATEGORIES}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredAndSortedItems.length > 0 ? (
            filteredAndSortedItems.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))
          ) : (
            <EmptyState
              hasSearch={!!debouncedSearch}
              searchTerm={debouncedSearch}
              onClear={clearFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
