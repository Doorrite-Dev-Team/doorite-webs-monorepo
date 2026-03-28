"use client";

import ActiveOrderTracker from "@/components/home/ActiveOrderTracker";

interface LiveTrackingSectionProps {
  order: Order;
}

export function LiveTrackingSection({ order }: LiveTrackingSectionProps) {
  return (
    <div className="px-4 sm:px-6 space-y-3">
      <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
        📍 Live Tracking
      </h2>
      <ActiveOrderTracker order={order} />
    </div>
  );
}
