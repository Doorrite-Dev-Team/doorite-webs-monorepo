"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { getActiveOrderStatusColor } from "@/lib/home";

interface ActiveOrderBannerProps {
  order: Order;
}

export function ActiveOrderBanner({ order }: ActiveOrderBannerProps) {
  const router = useRouter();
  const colorClass = getActiveOrderStatusColor(order.status);

  return (
    <div className="px-4 sm:px-6">
      <button
        onClick={() => router.push(`/order/${order.id}`)}
        className={cn(
          "w-full flex items-center gap-4 p-4 rounded-2xl border-2",
          "active:scale-[0.98] transition-all touch-manipulation text-left",
          colorClass,
        )}
      >
        {/* Pulsing dot */}
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
          <span className="relative w-3 h-3 rounded-full bg-current block" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">
            {order.status === "PREPARING"
              ? "Your order is being prepared"
              : "Your order is on the way! 🛵"}
          </p>
          <p className="text-xs opacity-70 truncate mt-0.5">
            #{order.id.slice(-8).toUpperCase()} · {order.items.length} item
            {order.items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
      </button>
    </div>
  );
}
