"use client";

export default function ExploreHeader({ isVendor }: { isVendor?: boolean }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Explore {isVendor ? "Vendors" : "Products"}
      </h1>
      <p className="text-gray-600">
        {isVendor
          ? "Discover vendors around you"
          : "Discover food, groceries and more around you"}
      </p>
    </div>
  );
}
