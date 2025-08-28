"use client";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { order } from "../libs/contant";
import {
  formatDate,
  formatTime,
  getStatusColor as getStatusBadgeClass,
  getStatusText,
} from "../libs/helper";

export const OrderCard = ({ order }: { order: order }) => {
  const router = useRouter();

  return (
    <Card
      className="border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/orders/${order.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
              #{order.id}
            </span>
            <Badge className={`${getStatusBadgeClass(order.status)} text-xs`}>
              {getStatusText(order.status)}
            </Badge>
          </div>
          <div className="font-semibold text-gray-900">
            ${order.total.toFixed(2)}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 truncate">
          {order.items.slice(0, 2).join(", ")}
          {order.items.length > 2 && ` +${order.items.length - 2} more`}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500">
            <span>
              {formatDate(order.orderTime)} • {formatTime(order.orderTime)}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Star size={12} className="text-yellow-400" />
            <span> {Math.max(4, order.orderDetails?.length ?? 0)}.0</span>
          </div>
        </div>

        {/* ETA for active orders */}
        {!["delivered", "cancelled"].includes(order.status) && (
          <div className="mt-2 text-sm text-green-600">
            Est. delivery: {formatTime(order.estimatedDelivery)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// -----------------------------------------------------------------------
// File: src/components/orders/OrdersList.tsx;

export const OrdersList = ({ orders }: { orders: order[] }) => {
  const sorted = [...orders].sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
  );

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-4">
      {sorted.map((o) => (
        <OrderCard order={o} key={o.id} />
      ))}
    </div>
  );
};
