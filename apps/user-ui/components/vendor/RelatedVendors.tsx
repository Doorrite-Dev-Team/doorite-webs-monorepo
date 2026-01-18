// components/vendor/RelatedVendors.tsx
"use client";

import VendorCard from "@/components/vendor/VendorCard";

interface RelatedVendorsProps {
  vendors: Vendor[];
}

export default function RelatedVendors({ vendors }: RelatedVendorsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
