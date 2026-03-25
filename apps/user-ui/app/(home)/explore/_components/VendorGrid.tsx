// app/(home)/explore/_components/VendorGrid.tsx

"use client";

import VendorCard from "@/components/vendor/VendorCard";
import VendorGridSkeleton from "./VendorGridSkeleton";
import EmptyState from "@/components/explore/EmptyState";

interface VendorGridProps {
  vendors: Vendor[];
  isLoading?: boolean;
}

export default function VendorGrid({ vendors, isLoading }: VendorGridProps) {
  if (isLoading) {
    return <VendorGridSkeleton />;
  }

  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        mode="vendors"
        hasSearch={false}
        searchTerm=""
        onClear={() => {}}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 will-change-transform transform-gpu">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
