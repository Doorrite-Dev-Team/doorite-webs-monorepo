import { Suspense } from "react";
import HomeClient from "@/components/home/HomeClient";
import HomePageSkeleton from "@/components/home/HomePageSkeleton";
import { Metadata } from "next";
import { serverApi as api } from "@/actions/server";
// import { revalidateCache } from "@/libs/api/revalidator";

export const metadata: Metadata = {
  title: "Home - Food Delivery",
  description: "Order food from your favorite restaurants",
};

export default async function HomePage() {
  // Fetch all data in parallel
  // await revalidateCache.profile();
  // // await revalidateCache.orders()
  // await revalidateCache.vendors();
  // await revalidateCache.homepage();
  const [user, recentOrders, topVendors] = await Promise.all([
    api.fetchProfile(),
    api.fetchRecentOrders(),
    api.fetchVendors("?limit=8"),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeClient
        user={user}
        recentOrders={recentOrders}
        topVendors={topVendors}
      />
    </Suspense>
  );
}
