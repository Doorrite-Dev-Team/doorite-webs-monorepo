"use client";

import { useAtom, useAtomValue } from "jotai";
import { activeOrderAtom, availableOrdersAtom, Order } from "@/store/orderAtom";
import { useState } from "react";
import { Package, MapPin, Clock, DollarSign, Navigation } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";

export default function OrdersDashboard() {
  const activeOrder = useAtomValue(activeOrderAtom);
  const availableOrders = useAtomValue(availableOrdersAtom);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage your deliveries</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            🚴 Available
          </Badge>
        </div>

        {/* Active Order Section */}
        {activeOrder && (
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Active Delivery</CardTitle>
                  <CardDescription>Currently in progress</CardDescription>
                </div>
                <Badge className="bg-blue-600">
                  {activeOrder.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Pickup</p>
                      <p className="text-gray-600 text-sm">{activeOrder.pickupLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Drop-off</p>
                      <p className="text-gray-600 text-sm">{activeOrder.dropoffLocation.address}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      ${activeOrder.totalAmount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-sm text-gray-500">{activeOrder.restaurantName}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      onClick={() => handleViewDetails(activeOrder)}
                    >
                      View Details
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Orders Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Orders</h2>
          {availableOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">No orders available</p>
                <p className="text-gray-400 text-sm mt-2">
                  New delivery requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {availableOrders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(order)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.restaurantName || "Restaurant"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          {order.estimatedDeliveryTime || "ASAP"}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span className="truncate">{order.pickupLocation.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{order.dropoffLocation.address}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Accept Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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
