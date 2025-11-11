"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import Axios from "@/libs/Axios";

import ExploreHeader from "@/components/explore/ExploreHeader";
import SearchBar from "@/components/explore/SearchBar";
import CategoryFilters from "@/components/explore/CategoryFilters";
import FilterControls from "@/components/explore/FilterControls";
import ResultsHeader from "@/components/explore/ResultsHeader";
import VendorCard from "@/components/explore/VendorCard";
import EmptyState from "@/components/explore/EmptyState";
import LoadingSkeleton from "@/components/explore/LoadingSkeleton";

// constants
import { CATEGORIES, SORT_OPTIONS, PRICE_FILTERS } from "@/libs/explore-config";

// Define the product type based on API response
type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isAvailable: boolean;
  vendor: {
    id: string;
    businessName: string;
    logoUrl: string | null;
  };
};

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [showOpenOnly, setShowOpenOnly] = useState(searchParams.get("open") === "true");

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedSearch] = useDebounceValue(search, 300);

  // ✅ Sync URL parameters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "all") params.set("category", category);
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (showOpenOnly) params.set("open", "true");

    router.replace(`/explore${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
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

  // ✅ Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const params: Record<string, string> = {};
      if (debouncedSearch) params.q = debouncedSearch;
      if (category !== "all") params.category = category;
      if (priceFilter !== "all") params.price = priceFilter;
      if (sortBy !== "popular") params.sort = sortBy;

      const queryString = new URLSearchParams(params).toString();
      const url = `/product${queryString ? `?${queryString}` : ""}`;

      const res = await Axios.get(url, { withCredentials: true });

      if (res.data?.ok && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, category, priceFilter, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Filter results client-side if needed
  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (showOpenOnly) {
      items = items.filter((p) => p.isAvailable);
    }

    return items;
  }, [products, showOpenOnly]);

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
          setCategory={setCategory}
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
          filteredCount={filteredProducts.length}
          category={category}
          categories={CATEGORIES}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <VendorCard
                key={product.id}
                vendor={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  priceRange: `₦${product.basePrice.toLocaleString()}`,
                  category: category,
                  isOpen: product.isAvailable,
                  logoUrl: product.vendor?.logoUrl,
                  businessName: product.vendor?.businessName,
                }}
              />
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
