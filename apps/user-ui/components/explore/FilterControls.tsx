"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Button } from "@repo/ui/components/button";
import { CheckCircle2, Circle, SlidersHorizontal } from "lucide-react";

export default function FilterControls({
  sortBy,
  setSortBy,
  sortOptions,
  priceFilter,
  setPriceFilter,
  priceFilters,
  showOpenOnly,
  setShowOpenOnly,
  clearFilters,
  hasActiveFilters,
}: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
          <SelectTrigger className="w-[180px] h-9 bg-white">
            <SlidersHorizontal size={16} className="mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o: any) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={(v) => setPriceFilter(v)}>
          <SelectTrigger className="w-[140px] h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceFilters.map((o: any) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showOpenOnly ? "default" : "outline"}
          onClick={() => setShowOpenOnly((s: boolean) => !s)}
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
  );
}
