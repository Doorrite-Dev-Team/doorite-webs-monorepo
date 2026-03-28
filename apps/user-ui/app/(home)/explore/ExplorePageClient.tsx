"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";
import { useExplore } from "@/hooks/use-explore";
import ExploreHeader from "@/components/explore/ExploreHeader";
import SearchBar from "@/components/explore/SearchBar";
import QuickFilters from "@/components/explore/QuickFilters";
import ProductSearchResults from "@/components/explore/ProductSearchResults";
import VendorCard from "@/components/vendor/VendorCard";
import EmptyState from "@/components/explore/EmptyState";
import LocationConsent from "@/components/explore/LocationConsent";
import { Button } from "@repo/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SavedAddressPicker from "@/components/explore/SavedAddressPicker";

const SESSION_LOCATION_KEY = "session_location_data";

type LocationData =
  | { type: "browser"; coords: { lat: number; long: number } }
  | { type: "address"; address: string; coords: { lat: number; long: number } }
  | { type: "denied" };

interface ExplorePageClientProps {
  initialVendors?: Vendor[];
  initialTotal?: number;
}

export default function ExplorePageClient({
  initialVendors = [],
  initialTotal = 0,
}: ExplorePageClientProps) {
  const [user] = useAtom(userAtom);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    state,
    debouncedQ,
    isProductSearch,
    hasActiveFilters,
    vendorsQuery,
    productsQuery,
    // cuisinesQuery,
    setParams,
    clearFilters,
    handleQuickFilterToggle,
    handlePageChange,
  } = useExplore({ userCoords });

  // Initialize location
  useEffect(() => {
    const initLocation = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_LOCATION_KEY);
        if (sessionData) {
          const data: LocationData = JSON.parse(sessionData);
          if (data.type !== "denied") {
            setUserCoords(data.coords);
          }
        } else {
          setShowLocationConsent(true);
        }
      } catch {
        sessionStorage.removeItem(SESSION_LOCATION_KEY);
        setShowLocationConsent(true);
      } finally {
        setIsInitializing(false);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(initLocation);
    } else {
      setTimeout(initLocation, 0);
    }
  }, []);

  const handleLocationAccept = (coords: { lat: number; long: number }) => {
    const data: LocationData = { type: "browser", coords };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));
    setUserCoords(coords);
    setShowLocationConsent(false);
  };

  const handleLocationDeny = () => {
    const data: LocationData = { type: "denied" };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));

    const addressesWithCoords = (user?.address || []).filter(
      (addr) => addr.coordinates?.lat && addr.coordinates?.long,
    );

    if (addressesWithCoords.length > 0) {
      setShowLocationConsent(false);
      setShowAddressPicker(true);
    } else {
      setShowLocationConsent(false);
    }
  };

  const handleSelectSavedAddress = (coords: { lat: number; long: number }) => {
    const data: LocationData = { type: "address", address: "Saved", coords };
    sessionStorage.setItem(SESSION_LOCATION_KEY, JSON.stringify(data));
    setUserCoords(coords);
    setShowAddressPicker(false);
  };

  if (isInitializing) {
    return (
      <div className="space-y-6 md:p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-200 rounded-md animate-pulse shrink-0"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const vendors = vendorsQuery.data?.vendors || initialVendors;
  const pagination = vendorsQuery.data?.pagination;
  const productResults = productsQuery.data?.groupedResults || [];

  return (
    <div className="space-y-6 p-4">
      <LocationConsent
        open={showLocationConsent}
        onAccept={handleLocationAccept}
        onDeny={handleLocationDeny}
      />

      <SavedAddressPicker
        open={showAddressPicker}
        addresses={user?.address || []}
        onSelect={handleSelectSavedAddress}
        onSkip={() => setShowAddressPicker(false)}
      />

      <ExploreHeader />

      <SearchBar
        placeholder="Search for food or restaurants..."
        search={state.q}
        setSearch={(q) => setParams({ q, page: 1 })}
      />

      {!isProductSearch && (
        <>
          <QuickFilters
            open={state.open}
            topRated={state.top_rated}
            onToggle={handleQuickFilterToggle}
          />
        </>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">
            {isProductSearch
              ? `${productsQuery.data?.totalProducts || 0} products found`
              : `${pagination?.total || initialTotal} vendors found`}
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              Clear filters
            </Button>
          )}
        </div>

        {!isProductSearch && (
          <select
            value={state.sort}
            onChange={(e) => setParams({ sort: e.target.value, page: 1 })}
            className="text-sm border rounded-md px-3 py-2 bg-background h-11"
          >
            <option value="recommended">Recommended</option>
            <option value="delivery_time">Fastest Delivery</option>
            <option value="distance">Nearest</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        )}
      </div>

      {/* Results */}
      {isProductSearch ? (
        productsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ProductSearchResults
            results={productResults}
            searchQuery={debouncedQ}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {vendorsQuery.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              />
            ))
          ) : vendors.length > 0 ? (
            vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                mode="vendors"
                hasSearch={!!state.q}
                searchTerm={state.q}
                onClear={clearFilters}
              />
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isProductSearch && pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(state.page - 1)}
            disabled={state.page === 1 || vendorsQuery.isLoading}
            className="h-11 px-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>

          <div className="flex items-center gap-1 px-4">
            <span className="text-sm font-medium">{state.page}</span>
            <span className="text-sm text-muted-foreground">of</span>
            <span className="text-sm font-medium">{pagination.pages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(state.page + 1)}
            disabled={state.page >= pagination.pages || vendorsQuery.isLoading}
            className="h-11 px-4"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
