"use client";

import VendorCard from "@/components/vendor/VendorCard";
import { SectionHeader } from "./SectionHeader";

interface MoreVendorsGridProps {
  vendors: Vendor[];
}

export function MoreVendorsGrid({ vendors }: MoreVendorsGridProps) {
  if (vendors.length === 0) return null;

  return (
    <div className="space-y-3">
      <SectionHeader
        title="More Restaurants"
        href="/explore"
        label="Explore all"
      />
      <div className="px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} priority={false} />
        ))}
      </div>
    </div>
  );
}
