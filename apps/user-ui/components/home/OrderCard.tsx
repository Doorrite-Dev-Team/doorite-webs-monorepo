"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Clock, Package, ChevronRight, MapPin, DollarSign } from "lucide-react";
import {
  formatDate,
  formatTime,
  getStatusColor,
  getStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from "@/libs/helper";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();

  const isActive =
    order.status === "OUT_FOR_DELIVERY" ||
    order.status === "PREPARING" ||
    order.status === "ACCEPTED";
  const isCompleted = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";

  return (
    <Card
      className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => router.push(`/order/${order.id}`)}
    >
      <CardContent className="p-0">
        {/* Header with Status */}
        <div
          className={`p-4 border-b ${
            isActive
              ? "bg-blue-50"
              : isCompleted
                ? "bg-green-50"
                : isCancelled
                  ? "bg-red-50"
                  : "bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-blue-100"
                    : isCompleted
                      ? "bg-green-100"
                      : isCancelled
                        ? "bg-red-100"
                        : "bg-gray-100"
                }`}
              >
                <Package
                  className={`w-6 h-6 ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-green-600"
                        : isCancelled
                          ? "text-red-600"
                          : "text-gray-600"
                  }`}
                />
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-0.5">Order ID</p>
                <p className="font-semibold text-gray-900">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <Badge
              className={`${getStatusColor(order.status)} text-xs font-medium`}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-4 space-y-4">
          {/* Items */}
          <div>
            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              Items ({order.items.length})
            </p>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{order.items.length - 2} more item(s)
                </p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 mb-0.5">Delivery to</p>
              <p className="text-gray-900 truncate">
                {order.deliveryAddress.address}
              </p>
            </div>
          </div>

          {/* Time & Payment Info */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {formatDate(order.placedAt)} • {formatTime(order.placedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getPaymentStatusColor(order.paymentStatus)} text-xs`}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
              </Badge>
            </div>
          </div>

          {/* Total & Action */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                {order.totalAmount.toFixed(2)}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 group-hover:gap-2 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/order/${order.id}`);
              }}
            >
              {isActive ? "Track Order" : "View Details"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* ETA for active orders */}
          {isActive && order.estimatedDelivery && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-xs text-blue-600 font-medium">
                  Estimated delivery
                </p>
                <p className="text-sm font-semibold text-blue-900">
                  {formatTime(order.estimatedDelivery)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
