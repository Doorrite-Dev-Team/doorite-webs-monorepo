"use client";

import { Order } from "@/store/orderAtom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  User,
  Phone,
  Navigation,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import { socketAtom } from "@/store/socketAtom";
import { apiClient } from "@/libs/api-client";
import { toast } from "@repo/ui/components/sonner";

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const setActiveOrder = useSetAtom(activeOrderAtom);
  const socket = useAtomValue(socketAtom);
  const [isActioning, setIsActioning] = useState(false);

  const handleAcceptOrder = async () => {
    setIsActioning(true);
    try {
      // 1. Tell the backend this rider is claiming the order
      await apiClient.post(`/orders/${order.id}/claim`);

      // 2. Emit socket event so backend dispatcher marks this rider as assigned
      socket?.emit("order-accepted", order.id);

      // 3. Update local Jotai state so the map/dashboard reflect the active order
      setActiveOrder(order);

      toast.success("Order accepted! Navigate to pickup location");
      onClose();

      toast.success("Order accepted! Navigate to pickup location");
      onClose();
    } catch (error) {
      console.error("Failed to accept order:", error);
      toast.error("Failed to accept order. Please try again.");
    } finally {
      setIsActioning(false);
    }
  };

  const handleDeclineOrder = async () => {
    setIsActioning(true);
    try {
      await apiClient.post(`/orders/${order.id}/decline`);
      toast.info("Order declined");
      onClose();
    } catch (error) {
      // Declining should fail silently — just close the modal
      console.warn("Decline API call failed (non-critical):", error);
      toast.info("Order declined");
      onClose();
    } finally {
      setIsActioning(false);
    }
  };

  const isActiveOrder = order.status !== "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {order.restaurantName || "Order Details"}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Order ID: #{order.id.slice(0, 8)}
              </DialogDescription>
            </div>
            <Badge
              variant={order.status === "delivered" ? "default" : "secondary"}
              className="text-sm"
            >
              {order.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Earnings */}
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-700">Earnings</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₦{order.totalAmount?.toFixed(2) || "0.00"}
            </p>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-900 font-medium">
                {order.customerName || "Customer"}
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{(order as any).customerPhone || "Phone hidden"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Delivery Route</h3>
            <div className="space-y-4">
              {/* Pickup */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.pickupLocation.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.pickupLocation.lat.toFixed(4)},{" "}
                    {order.pickupLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Drop-off Location
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.dropoffLocation.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.dropoffLocation.lat.toFixed(4)},{" "}
                    {order.dropoffLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          {order.estimatedDeliveryTime && (
            <>
              <Separator />
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.estimatedDeliveryTime}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Order Items (if available) */}
          {order.items && order.items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ₦{item.price?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {!isActiveOrder ? (
            <>
              <Button
                variant="outline"
                onClick={handleDeclineOrder}
                className="flex-1"
                disabled={isActioning}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isActioning ? "..." : "Decline"}
              </Button>
              <Button
                onClick={handleAcceptOrder}
                className="flex-1"
                disabled={isActioning}
              >
                {isActioning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {isActioning ? "Accepting..." : "Accept Order"}
              </Button>
            </>
          ) : (
            <Button className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Navigate to {order.status === "accepted" ? "Pickup" : "Customer"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
