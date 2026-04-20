"use client";

import { useAtomValue } from "jotai";
import {
  activeOrderAtom,
  availableOrdersAtom,
  Order,
} from "@/store/orderAtom";
import { riderAtom } from "@/store/riderAtom";
import { useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";

export default function DashboardPage() {
  const rider = useAtomValue(riderAtom);
  const activeOrder = useAtomValue(activeOrderAtom);
  const availableOrders = useAtomValue(availableOrdersAtom);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
        return "bg-amber-100 text-amber-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hey, {rider?.name?.split(" ")[0] || rider?.fullName?.split(" ")[0] || "Rider"}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {activeOrder
            ? "You have an active delivery"
            : "Ready for your next delivery?"}
        </p>
      </div>

      {/* Active Delivery */}
      {activeOrder && (
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-0">
            {/* Status bar */}
            <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-500" />

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                    Active Delivery
                  </span>
                </div>
                <Badge className={getStatusColor(activeOrder.status)}>
                  {activeOrder.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {activeOrder.restaurantName || "Restaurant"}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="truncate">
                        {activeOrder.pickupLocation.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className="truncate">
                        {activeOrder.dropoffLocation.address}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600 shrink-0">
                  ₦{activeOrder.totalAmount?.toFixed(0) || "0"}
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleViewDetails(activeOrder)}
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Navigation className="w-4 h-4 mr-1.5" />
                  Navigate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Available Orders</h2>
          {availableOrders.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {availableOrders.length} nearby
            </Badge>
          )}
        </div>

        {availableOrders.length === 0 ? (
          <Card className="border-dashed border-gray-200">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">No orders available</p>
              <p className="text-sm text-gray-400 mt-1">
                New delivery requests will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {availableOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-all cursor-pointer border-gray-100 hover:border-green-200"
                onClick={() => handleViewDetails(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {order.restaurantName || "Restaurant"}
                      </p>
                      {order.estimatedDeliveryTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{order.estimatedDeliveryTime}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl font-bold text-green-600 shrink-0">
                      ₦{order.totalAmount?.toFixed(0) || "0"}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="truncate">
                        {order.pickupLocation.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">
                        {order.dropoffLocation.address}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    View & Accept
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
