"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";

import {
  CheckCircle2,
  Circle,
  Clock,
  Cross,
  MapPin,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { VENDORS } from "@/libs/contant";
import { vendorImage } from "@/libs/utils";

/* --- Configs --- */
const CATEGORIES = [
  {
    id: "all",
    name: "All",
    icon: Search,
    color: "bg-gray-50 text-gray-600 border-gray-200",
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: UtensilsCrossed,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: "grocery",
    name: "Groceries",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: Cross,
    color: "bg-red-50 text-red-600 border-red-200",
  },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "fastest", label: "Fastest Delivery" },
];

const PRICE_FILTERS = [
  { value: "all", label: "Any Price" },
  { value: "$", label: "Budget ($)" },
  { value: "$$", label: "Moderate ($$)" },
  { value: "$$$", label: "Premium ($$$)" },
];

/* --- Component --- */
export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize states from URL params (safe - client only)
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

  /* Update URL with all filters (push state without scroll) */
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "all") params.set("category", category);
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (showOpenOnly) params.set("open", "true");

    const newURL = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/explore${newURL}`, { scroll: false });
  }, [router, search, category, sortBy, priceFilter, showOpenOnly]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  /* Clear filters */
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("popular");
    setPriceFilter("all");
    setShowOpenOnly(false);
  };

  /* -------- PURE computation: filtered & sorted items (no side-effects) -------- */
  const filteredAndSortedItems = useMemo(() => {
    // Defensive: ensure VENDORS is array
    const vendorsArray = Array.isArray(VENDORS) ? VENDORS : [];
    let items = [...vendorsArray] as Vendor[];

    // Category
    if (category !== "all") {
      items = items.filter((v) => v.category === category);
    }

    // Search (debounced)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (v) =>
          (v.businessName || "").toLowerCase().includes(q) ||
          (v.description || "").toLowerCase().includes(q) ||
          (v.subcategory || "").toLowerCase().includes(q) ||
          (v.tags || []).some((tag) => (tag || "").toLowerCase().includes(q))
      );
    }

    // Price
    if (priceFilter !== "all") {
      items = items.filter((v) => v.priceRange === priceFilter);
    }

    // Open only
    if (showOpenOnly) {
      items = items.filter((v) => v.isOpen);
    }

    // Sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "fastest":
          // safe parseInt with fallback
          return (
            (parseInt(a.avrgPreparationTime || "0", 10) || 0) -
            (parseInt(b.avrgPreparationTime || "0", 10) || 0)
          );
        case "popular":
        default:
          // simple popularity heuristic
          return (
            (b.rating || 0) * (5 - (a.distance || 0)) -
            (a.rating || 0) * (5 - (b.distance || 0))
          );
      }
    });

    return items;
  }, [category, debouncedSearch, sortBy, priceFilter, showOpenOnly]);

  /* -------- Side-effect: manage loading AFTER render (safe for SSR/prerender) -------- */
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

  /* -------- UI helpers -------- */
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 bg-gray-50/50">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="w-24 h-20 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Campus
          </h1>
          <p className="text-gray-600">
            Discover food, groceries and more around you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Search for food, vendors, or items..."
              className="w-full h-12 pl-12 pr-12 text-base bg-white border-2 border-gray-200 rounded-lg focus:border-primary transition-colors"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.id;
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap h-10 ${isActive ? "bg-primary text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  <Icon size={16} />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger className="w-[180px] h-9 bg-white">
                <SlidersHorizontal size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priceFilter}
              onValueChange={(v) => setPriceFilter(v)}
            >
              <SelectTrigger className="w-[140px] h-9 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_FILTERS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showOpenOnly ? "default" : "outline"}
              onClick={() => setShowOpenOnly((s) => !s)}
              className="h-9 bg-white hover:bg-gray-50"
            >
              {showOpenOnly ? (
                <CheckCircle2 size={16} className="mr-2" />
              ) : (
                <Circle size={16} className="mr-2" />
              )}
              Open Now
            </Button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 h-9"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              {debouncedSearch ? (
                <>
                  <span>Results for </span>
                  <span className="font-semibold text-primary">
                    &quot;{debouncedSearch}&quot;
                  </span>
                  <span className="ml-2">
                    • {filteredAndSortedItems.length} found
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Showing {filteredAndSortedItems.length}{" "}
                    {category === "all"
                      ? "places"
                      : CATEGORIES.find(
                          (c) => c.id === category
                        )?.name.toLowerCase()}
                  </span>
                  {hasActiveFilters && (
                    <span className="ml-2 text-primary">• Filtered</span>
                  )}
                </>
              )}
            </p>
          </div>

          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredAndSortedItems.length} results
          </Badge>
        </div>

        {/* Results */}
        <div className="space-y-4">
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

/* -------- Vendor Card & Empty State (unchanged semantics) -------- */
function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="block group">
      <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.01]">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {vendor.businessName}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {vendor.subcategory} • {vendor.avrgPreparationTime}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium">
                      {vendor.rating ?? "-"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{vendor.priceRange}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {vendor.description}
              </p>

              <div className="flex items-center gap-3 text-xs">
                <Badge
                  variant={vendor.isOpen ? "default" : "secondary"}
                  className={`text-xs ${vendor.isOpen ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600"}`}
                >
                  {vendor.isOpen ? "Open" : "Closed"}
                </Badge>

                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin size={12} />
                  <span>{vendor.distance ?? "-"} km</span>
                </div>

                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock size={12} />
                  <span>{vendor.avrgPreparationTime ?? "-"}</span>
                </div>
              </div>
            </div>

            <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {vendor.logoUrl ? (
                <Image
                  src={vendor.logoUrl as string}
                  alt={vendor.businessName}
                  width={80}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : typeof vendor.image === "string" ? (
                <div className="text-2xl">{vendor.image}</div>
              ) : (
                <Image
                  src={vendorImage(vendor.image)}
                  alt={vendor.businessName}
                  width={80}
                  height={64}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({
  hasSearch,
  searchTerm,
  onClear,
}: {
  hasSearch: boolean;
  searchTerm: string;
  onClear: () => void;
}) {
  return (
    <Card className="border-0 bg-white">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          {hasSearch ? "No results found" : "No vendors available"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {hasSearch
            ? `We couldn't find anything matching "${searchTerm}". Try different keywords or clear your filters.`
            : "Try adjusting your filters or search for something specific."}
        </p>
        <Button onClick={onClear} className="bg-primary hover:bg-primary/90">
          {hasSearch ? "Clear search & filters" : "Reset filters"}
        </Button>
      </CardContent>
    </Card>
  );
}
