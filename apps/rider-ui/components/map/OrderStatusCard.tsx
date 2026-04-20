"use client";

import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { Navigation, MapPin, Package } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import DeliveryCompletionModal from "../orders/DeliveryCompletionModal";

export default function OrderStatusCard() {
  const activeOrder = useAtomValue(activeOrderAtom);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  if (!activeOrder) {
    return (
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-100">
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700">No Active Delivery</p>
          <p className="text-sm mt-0.5">Accept an order to start delivering</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-500";
      case "picked_up":
        return "bg-amber-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getNextAction = () => {
    switch (activeOrder.status) {
      case "accepted":
        return "Navigate to Pickup";
      case "picked_up":
        return "Navigate to Customer";
      default:
        return "View Details";
    }
  };

  return (
    <>
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Status Bar */}
        <div className={`${getStatusColor(activeOrder.status)} px-4 py-2`}>
          <p className="text-white text-xs font-bold uppercase tracking-wide">
            {activeOrder.status.replace("_", " ")}
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base text-gray-900 truncate">
                {activeOrder.restaurantName || "Restaurant"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {activeOrder.customerName || "Customer"}
              </p>
            </div>
            <p className="text-xl font-bold text-green-600 shrink-0 ml-3">
              ₦{activeOrder.totalAmount?.toFixed(0) || "0"}
            </p>
          </div>

          {/* Locations */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-gray-600 truncate text-xs">
                {activeOrder.pickupLocation.address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span className="text-gray-600 truncate text-xs">
                {activeOrder.dropoffLocation.address}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 h-10" size="sm">
              <Navigation className="w-4 h-4 mr-1.5" />
              {getNextAction()}
            </Button>
            {activeOrder.status === "picked_up" && (
              <Button
                className="flex-1 h-10 bg-green-600 hover:bg-green-700"
                size="sm"
                onClick={() => setShowCompletionModal(true)}
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      <DeliveryCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </>
  );
}
