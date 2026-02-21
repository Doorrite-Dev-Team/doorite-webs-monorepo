"use client";

import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { Navigation, MapPin, Clock, DollarSign, Package } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import DeliveryCompletionModal from "../orders/DeliveryCompletionModal";

export default function OrderStatusCard() {
    const activeOrder = useAtomValue(activeOrderAtom);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    if (!activeOrder) {
        return (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4">
                <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No Active Delivery</p>
                    <p className="text-sm">Accept an order to start delivering</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted":
                return "bg-blue-500";
            case "picked_up":
                return "bg-orange-500";
            case "delivered":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const getNextAction = () => {
        switch (activeOrder.status) {
            case "accepted":
                return { label: "Navigate to Pickup", action: "navigate-pickup" };
            case "picked_up":
                return { label: "Navigate to Customer", action: "navigate-dropoff" };
            default:
                return { label: "View Details", action: "details" };
        }
    };

    const nextAction = getNextAction();

    const handleAction = () => {
        if (activeOrder.status === "picked_up") {
            // For picked_up status, we also want to show complete option
            // User can navigate first, then complete
        }
    };

    return (
        <>
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Status Bar */}
                <div className={`${getStatusColor(activeOrder.status)} px-4 py-2`}>
                    <p className="text-white text-sm font-semibold uppercase tracking-wide">
                        {activeOrder.status.replace("_", " ")}
                    </p>
                </div>

                {/* Order Info */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-lg">{activeOrder.restaurantName || "Restaurant"}</h3>
                            <p className="text-sm text-gray-600">{activeOrder.customerName || "Customer"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                                ${activeOrder.totalAmount?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2 text-sm">
                            <Package className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium">Pickup</p>
                                <p className="text-gray-600 text-xs">{activeOrder.pickupLocation.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium">Drop-off</p>
                                <p className="text-gray-600 text-xs">{activeOrder.dropoffLocation.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button className="flex-1" size="lg" onClick={handleAction}>
                            <Navigation className="w-4 h-4 mr-2" />
                            {nextAction.label}
                        </Button>
                        {activeOrder.status === "picked_up" && (
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                size="lg"
                                onClick={() => setShowCompletionModal(true)}
                            >
                                Complete
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Delivery Completion Modal */}
            <DeliveryCompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
            />
        </>
    );
}
