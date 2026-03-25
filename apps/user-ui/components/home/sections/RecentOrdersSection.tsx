"use client";

import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import OrderCard from "@/components/home/OrderCard";
import { SectionHeader } from "./SectionHeader";

interface RecentOrdersSectionProps {
  orders: Order[];
}

function EmptyOrders() {
  return (
    <div className="mx-4 sm:mx-6 flex flex-col items-center justify-center py-12 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
      <span className="text-4xl mb-3">🛍️</span>
      <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-5">
        Your order history will appear here once you place your first order.
      </p>
      <Link href="/explore">
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Order Now
        </Button>
      </Link>
    </div>
  );
}

export function RecentOrdersSection({ orders }: RecentOrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <div className="space-y-3">
        <SectionHeader
          title="🧾 Recent Orders"
          href="/order"
          label="View all"
        />
        <EmptyOrders />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionHeader title="🧾 Recent Orders" href="/order" label="View all" />
      <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 sm:px-6 pb-1">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="shrink-0 w-[280px] sm:w-[300px]">
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    </div>
  );
}
