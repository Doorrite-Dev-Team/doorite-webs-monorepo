// "use client";
import { OrdersList } from "@/components/order/order-card";
import { orders } from "@/libs/contant";
import { MessageSquare } from "lucide-react";

export default function OrderTrackingPage() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <div className="p-4">
        <p className="text-xl text-primary font-semibold mb-4">Recent Orders</p>
        <OrdersList orders={orders} />

        {orders.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
