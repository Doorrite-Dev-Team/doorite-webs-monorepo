import { serverApi } from "@/actions/server";
import { Metadata } from "next";
import { Suspense } from "react";
import ExplorePageClient from "./ExplorePageClient";
import VendorGridSkeleton from "./_components/VendorGridSkeleton";

export const metadata: Metadata = {
  title: "Explore | Find Restaurants & Food",
  description:
    "Discover the best restaurants, food vendors, and cuisine near you. Browse menus, read reviews, and order your favorite meals.",
};

export const dynamic = "force-dynamic";
export default async function ExplorePage() {
  const vendorsData = await serverApi.fetchVendors("?limit=12");

  return (
    <Suspense fallback={<VendorGridSkeleton />}>
      <ExplorePageClient
        initialVendors={vendorsData.vendors}
        initialTotal={vendorsData.vendors.length}
        initialMessage={vendorsData.message}
      />
    </Suspense>
  );
}
