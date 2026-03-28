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

export default async function ExplorePage() {
  // Fetch initial vendors server-side for better SEO and faster initial load
  const initialVendors = await serverApi.fetchVendors("?limit=12");

  return (
    <Suspense fallback={<VendorGridSkeleton />}>
      <ExplorePageClient
        initialVendors={initialVendors}
        initialTotal={initialVendors.length}
      />
    </Suspense>
  );
}
