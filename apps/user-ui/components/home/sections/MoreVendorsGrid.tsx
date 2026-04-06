"use client";

import VendorCard from "@/components/vendor/VendorCard";
import { SectionHeader } from "./SectionHeader";

interface MoreVendorsGridProps {
  vendors: Vendor[];
  message?: string;
}

export function MoreVendorsGrid({ vendors, message }: MoreVendorsGridProps) {
  const isStateMessage = message && message.includes("not yet available");

  // Only show the section if there are vendors OR if there's no state message
  if (vendors.length === 0 && !isStateMessage) return null;

  return (
    <div className="space-y-3">
      {isStateMessage ? (
        <div className="px-4 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚚</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coming Soon to Your Area
          </h3>
          <p className="text-green-600 font-medium max-w-sm mx-auto">
            {message}
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
