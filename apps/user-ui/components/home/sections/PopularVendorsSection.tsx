"use client";

import VendorCard from "@/components/vendor/VendorCard";
import { SectionHeader } from "./SectionHeader";

interface PopularVendorsSectionProps {
  vendors: Vendor[];
}

function EmptyVendors() {
  return (
    <div className="mx-4 sm:mx-6 flex flex-col items-center justify-center py-12 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
      <span className="text-4xl mb-3">🍽️</span>
      <p className="font-semibold text-gray-700 mb-1">No restaurants yet</p>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        We&apos;re onboarding great restaurants near you. Check back soon!
      </p>
    </div>
  );
}

export function PopularVendorsSection({ vendors }: PopularVendorsSectionProps) {
  const hasVendors = vendors.length > 0;

  return (
    <div className="space-y-3">
      <SectionHeader
        title="🔥 Popular Near You"
        href="/explore"
        label="See all"
      />
      {hasVendors ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 sm:px-6 pb-1">
          {vendors.map((vendor, i) => (
            <div key={vendor.id} className="shrink-0 w-[260px] sm:w-[280px]">
              <VendorCard vendor={vendor} priority={i < 3} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyVendors />
      )}
    </div>
  );
}
