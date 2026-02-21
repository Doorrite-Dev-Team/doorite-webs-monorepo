"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { parseAsString, parseAsBoolean, useQueryStates } from "nuqs";
import { api } from "@/libs/api";
import VendorCard from "@/components/vendor/VendorCard";
import LoadingSkeleton from "@/components/explore/LoadingSkeleton";
import EmptyState from "@/components/explore/EmptyState";
import { Switch } from "@repo/ui/components/switch"; // Assuming you have UI components
import { Label } from "@repo/ui/components/label";

const vendorParsers = {
  q: parseAsString.withDefault(""),
  open: parseAsBoolean.withDefault(false),
};

export default function VendorsView() {
  const [{ q, open }, setParams] = useQueryStates(vendorParsers, {
    history: "replace",
    shallow: false,
  });

  const [debouncedQ] = useDebounceValue(q, 500);

  const params: Record<string, string> = {};
  if (debouncedQ) params.q = debouncedQ;
  // if (category !== "all") params.category = category;
  if (open) params.open = "true";

  const queryString = new URLSearchParams(params).toString();

  const { data, isLoading } = useQuery({
    queryKey: ["vendors", { q: debouncedQ, open }],
    queryFn: () => api.fetchVendors(queryString),
  });

  const vendors = data?.vendors || [];

  return (
    <div className="space-y-6">
      {/* Vendor Specific Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center space-x-2">
          <Switch
            id="vendor-open"
            checked={open}
            onCheckedChange={(c) => setParams({ open: c })}
          />
          <Label htmlFor="vendor-open">Show Open Vendors Only</Label>
        </div>
        <span className="text-sm text-gray-500">
          {vendors.length} Vendors found
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
        ) : vendors.length > 0 ? (
          vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              mode="vendors"
              hasSearch={!!q}
              searchTerm={q}
              onClear={() => setParams({ q: "", open: false })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
