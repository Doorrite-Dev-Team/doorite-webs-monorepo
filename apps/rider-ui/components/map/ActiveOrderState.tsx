"use client";

import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { MapPin, Package } from "lucide-react";

export default function ActiveOrderState() {
  const activeOrder = useAtomValue(activeOrderAtom);

  if (!activeOrder) return null;

  const statusLabel =
    activeOrder.status === "accepted"
      ? "Heading to pickup"
      : activeOrder.status === "picked_up"
        ? "Heading to customer"
        : activeOrder.status.replace("_", " ");

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 bg-white rounded-t-3xl p-6 shadow-2xl border-t border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Order #{activeOrder.id.slice(0, 6)}
          </h2>
          <p className="text-sm text-gray-500">{statusLabel}</p>
        </div>
        <p className="text-xl font-bold text-green-600">
          ₦{activeOrder.totalAmount?.toFixed(0) || "0"}
        </p>
      </div>

      <div className="space-y-2 mt-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4 text-green-500 shrink-0" />
          <span className="truncate">{activeOrder.pickupLocation.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">
            {activeOrder.dropoffLocation.address}
          </span>
        </div>
      </div>

      <button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-colors">
        {activeOrder.status === "accepted" ? "Mark Arrived" : "Complete Delivery"}
      </button>
    </div>
  );
}
