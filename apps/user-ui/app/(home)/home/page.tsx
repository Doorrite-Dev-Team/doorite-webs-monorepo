import { Suspense } from "react";
import HomeClient from "@/components/home/HomeClient";
import HomePageSkeleton from "@/components/home/HomePageSkeleton";
import { Metadata } from "next";
import { serverApi as api } from "@/actions/server";

export const metadata: Metadata = {
  title: "Home - Food Delivery",
  description: "Order food from your favorite restaurants",
};

export default async function HomePage() {
  const [user, recentOrders, vendorsData] = await Promise.all([
    api.fetchProfile(),
    api.fetchRecentOrders(),
    api.fetchVendors("?limit=8"),
  ]);

  const topVendors = vendorsData.vendors;
  const message = vendorsData.message;

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeClient
        user={user}
        recentOrders={recentOrders}
        topVendors={topVendors}
        message={message}
        addresses={user?.address || []}
      />
    </Suspense>
  );
}
