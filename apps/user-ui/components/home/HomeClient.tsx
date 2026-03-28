"use client";

import { HeroBanner } from "./sections/HeroBanner";
import { CategoryPills } from "./sections/CategoryPills";
import { ActiveOrderBanner } from "./sections/ActiveOrderBanner";
import { PromoBanner } from "./sections/PromoBanner";
import { PopularVendorsSection } from "./sections/PopularVendorsSection";
import { LiveTrackingSection } from "./sections/LiveTrackingSection";
import { RecentOrdersSection } from "./sections/RecentOrdersSection";
import { MoreVendorsGrid } from "./sections/MoreVendorsGrid";
import { FooterCTA } from "./sections/FooterCTA";
import { findActiveOrder } from "@/lib/home";

interface HomeClientProps {
  user: User | null;
  recentOrders: Order[];
  topVendors: Vendor[];
}

/**
 * Main home page client component
 *
 * Mobile-first responsive layout based on h.tsx design:
 * - Dark hero banner with search and avatar
 * - Horizontal scrolling cuisine category pills
 * - Active order banner (when applicable)
 * - Promo banner for top rated
 * - Horizontal vendor strip
 * - Live order tracking map (when applicable)
 * - Recent orders horizontal scroll
 * - More restaurants grid
 * - Footer CTA button
 */
export default function HomeClient({
  user,
  recentOrders,
  topVendors,
}: HomeClientProps) {
  const activeOrder = findActiveOrder(recentOrders);

  // Split vendors: first 6 in horizontal strip, remaining in grid below
  const stripVendors = topVendors.slice(0, 6);
  const gridVendors = topVendors.slice(6);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero Banner with Search */}
      <HeroBanner user={user} />

      {/* Category Pills */}
      <div className="bg-white pt-4 pb-3 shadow-sm">
        <CategoryPills />
      </div>

      <div className="space-y-7 pt-6">
        {/* Active Order Banner */}
        {activeOrder && <ActiveOrderBanner order={activeOrder} />}

        {/* Promo Banner */}
        <PromoBanner />

        {/* Popular Vendors Strip */}
        <PopularVendorsSection vendors={stripVendors} />

        {/* Live Order Tracker */}
        {activeOrder && <LiveTrackingSection order={activeOrder} />}

        {/* Recent Orders */}
        <RecentOrdersSection orders={recentOrders} />

        {/* More Restaurants Grid */}
        <MoreVendorsGrid vendors={gridVendors} />

        {/* Footer CTA */}
        <FooterCTA />
      </div>
    </div>
  );
}
