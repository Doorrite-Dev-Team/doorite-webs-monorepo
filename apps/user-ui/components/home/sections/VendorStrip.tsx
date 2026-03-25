"use client";

import VendorCard from "@/components/vendor/VendorCard";

interface VendorStripProps {
  vendors: Vendor[];
}

export function VendorStrip({ vendors }: VendorStripProps) {
  if (vendors.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 sm:px-6 pb-1">
      {vendors.map((vendor, i) => (
        <div key={vendor.id} className="shrink-0 w-[260px] sm:w-[280px]">
          <VendorCard vendor={vendor} priority={i < 3} />
        </div>
      ))}
    </div>
  );
}
