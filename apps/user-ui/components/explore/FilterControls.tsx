"use client";

// components/explore/FilterControls.responsive.tsx
import React, { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Badge } from "@repo/ui/components/badge";

interface FilterControlsProps {
  sortBy: string;
  setSortByAction: (value: string) => void;
  sortOptions: Array<{ value: string; label: string }>;
  priceFilter: string;
  setPriceFilterAction: (value: string) => void;
  priceFilters: Array<{ value: string; label: string }>;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  clearFiltersAction: () => void;
  hasActiveFilters: boolean;
  mode: "products" | "vendors";
}

export default function FilterControls({
  sortBy,
  setSortByAction,
  sortOptions,
  priceFilter,
  setPriceFilterAction,
  priceFilters,
  showOpenOnly,
  setShowOpenOnly,
  clearFiltersAction,
  hasActiveFilters,
  mode,
}: FilterControlsProps) {
  // Mobile-first: collapse filters behind a toggle on small screens
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Clear action - visible on all sizes but compact on mobile */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFiltersAction}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-1"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}

          {/* Collapse toggle - useful on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="filter-controls-panel"
            className="flex items-center gap-1"
          >
            <span className="sr-only">Toggle filters</span>
            <span className="text-sm font-medium">
              {open ? "Hide" : "Show"}
            </span>
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible panel - transitions help the mobile UX */}
      <div
        id="filter-controls-panel"
        className={`mt-3 transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Sort By</label>
            <Select value={sortBy} onValueChange={setSortByAction}>
              <SelectTrigger className="h-12 sm:h-10 w-full rounded-lg border border-gray-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Price Range
            </label>
            <Select value={priceFilter} onValueChange={setPriceFilterAction}>
              <SelectTrigger className="h-12 sm:h-10 w-full rounded-lg border border-gray-200">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {priceFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Open Only Toggle */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              {mode === "vendors" ? "Open Vendors" : "From Open Vendors"}
            </label>
            <div className="flex items-center justify-between h-12 sm:h-10 px-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Switch
                  checked={showOpenOnly}
                  onCheckedChange={setShowOpenOnly}
                  className="mr-1"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">
                    {showOpenOnly ? "Open only" : "All"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {mode === "vendors"
                      ? "Show only vendors currently open"
                      : "Show products from open vendors"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra actions row for larger screens - keeps primary controls compact on mobile */}
        <div className="mt-3 hidden sm:flex sm:items-center sm:justify-end gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFiltersAction}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
