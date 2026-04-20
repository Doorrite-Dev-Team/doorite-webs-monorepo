"use client";

import { useAtomValue } from "jotai";
import { availableOrdersAtom, Order } from "@/store/orderAtom";

type Props = {
  onAccept: (order: Order) => void;
  onDecline: () => void;
};

export default function IncomingOrderState({ onAccept, onDecline }: Props) {
  const availableOrders = useAtomValue(availableOrdersAtom);
  const order = availableOrders[0];

  if (!order) {
    return null;
  }

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 p-4">
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-lg text-gray-900">
            {order.restaurantName || "New Order"}
          </h3>
          <p className="text-xl font-bold text-green-600">
            ₦{order.totalAmount?.toFixed(0) || "0"}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {order.estimatedDeliveryTime || "ASAP"}
        </p>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {order.pickupLocation.address}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={onDecline}
            className="border border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept(order)}
            className="bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition-colors"
          >
            Accept Order
          </button>
        </div>
      </div>
    </div>
  );
}
