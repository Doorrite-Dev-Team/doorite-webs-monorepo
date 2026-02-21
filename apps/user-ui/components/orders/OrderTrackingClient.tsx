"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Store,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Separator } from "@repo/ui/components/separator";
import DeliveryMap from "@/components/orders/DeliveryMap";
import RiderInfoCard from "@/components/orders/RiderInfoCard";
import DeliveryQrDisplay from "@/components/orders/DeliveryQrDisplay";
import { formatTime, getStatusColor, getStatusLabel } from "@/libs/helper";
import { api } from "@/libs/api";

interface OrderTrackingClientProps {
  order: Order;
}

export default function OrderTrackingClient({
  order: initialOrder,
}: OrderTrackingClientProps) {
  const router = useRouter();
  const [showQrScanner, setShowQrScanner] = React.useState(false);

  // Poll for order updates every 30 seconds
  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", initialOrder.id],
    queryFn: () => api.fetchOrder(initialOrder.id),
    initialData: initialOrder,
    refetchInterval: 30000, // 30 seconds
    staleTime: 10000, // 10 seconds
  });

  if (!order) notFound();

  const isOutForDelivery = order.status === "OUT_FOR_DELIVERY";
  const isDelivered = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";

  // Calculate estimated delivery time
  const estimatedDeliveryTime = React.useMemo(() => {
    if (order.deliveredAt) {
      return new Date(order.deliveredAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (order.estimatedDelivery) {
      return formatTime(order.estimatedDelivery);
    }
    // Default estimation: 30-45 mins from placed time
    const placedTime = new Date(order.placedAt);
    const estimated = new Date(placedTime.getTime() + 45 * 60000);
    return formatTime(estimated.toISOString());
  }, [order]);

  if (showQrScanner) {
    return (
      <DeliveryQrDisplay
        orderId={order.id}
        verificationCode={order.deliveryVerificationCode}
        onClose={() => setShowQrScanner(false)}
        onVerified={() => {
          refetch();
          setShowQrScanner(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    isCancelled
                      ? "destructive"
                      : isDelivered
                        ? "secondary"
                        : "default"
                  }
                  className={`${getStatusColor(order.status)} text-sm`}
                >
                  {getStatusLabel(order.status)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Delivery Map - Show only when out for delivery */}
          {isOutForDelivery && order.riderId && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <DeliveryMap
                  orderId={order.id}
                  deliveryAddress={order.deliveryAddress}
                />
                <RiderInfoCard orderId={order.id} riderId={order.riderId} />
              </CardContent>
            </Card>
          )}

          {/* Estimated Delivery */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {isDelivered ? "Delivered At" : "Estimated Delivery"}
                </h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {estimatedDeliveryTime}
                </span>
                {!isDelivered && !isCancelled && (
                  <span className="text-gray-600">today</span>
                )}
              </div>
              {isDelivered && order.deliveredAt && (
                <p className="text-sm text-gray-600 mt-2">
                  Delivered on{" "}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Timeline
                </h2>
              </div>

              <div className="space-y-6">
                {order.history.map((step, idx) => {
                  const isCompleted =
                    order.history.findIndex((h) => h.status === order.status) >=
                    idx;
                  const isActive = step.status === order.status;

                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-primary border-primary"
                              : "bg-white border-gray-300"
                          } ${isActive ? "ring-4 ring-primary/20" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {idx < order.history.length - 1 && (
                          <div
                            className={`w-[2px] h-12 mt-2 transition-colors ${
                              isCompleted ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <p
                            className={`font-semibold ${isActive ? "text-primary" : "text-gray-900"}`}
                          >
                            {getStatusLabel(step.status)}
                          </p>
                          <span className="text-sm text-gray-600">
                            {new Date(step.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        {step.note && (
                          <p className="text-sm text-gray-600 mt-1">
                            {step.note}
                          </p>
                        )}

                        {step.actorType && (
                          <div className="flex items-center gap-1 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {step.actorType}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Store className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h3>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-blue-900">
                    Payment Status:{" "}
                    <span className="font-semibold">
                      {order.paymentStatus.replace("_", " ")}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </h3>
              </div>

              <div className="space-y-2">
                <p className="text-gray-900">{order.deliveryAddress.address}</p>
                {order.deliveryAddress.state && (
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.state}
                    {order.deliveryAddress.country &&
                      `, ${order.deliveryAddress.country}`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support Buttons */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="tel:+2348000000000" className="block">
                  <Button variant="outline" className="w-full gap-2 h-12">
                    <Phone className="w-4 h-4" />
                    Call Support
                  </Button>
                </a>

                <Button variant="outline" className="w-full gap-2 h-12">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Button - Show only when out for delivery */}
      {isOutForDelivery && order.deliveryVerificationCode && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={() => setShowQrScanner(true)}
            className="rounded-full w-16 h-16 shadow-2xl hover:scale-110 transition-transform"
          >
            <QrCode className="w-8 h-8" />
          </Button>
        </div>
      )}
    </div>
  );
}
