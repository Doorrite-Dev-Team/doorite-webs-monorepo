"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Order {
  id: number;
  status: "New" | "Preparing" | "Ready";
  items: number;
  time: string;
  customer: string;
  image: string;
}

const orders: Order[] = [
  {
    id: 12345,
    status: "New",
    items: 2,
    time: "10:15 AM",
    customer: "Ethan",
    image: "/assets/images/order1.png",
  },
  {
    id: 67890,
    status: "Preparing",
    items: 3,
    time: "10:00 AM",
    customer: "Sophia",
    image: "/assets/images/order2.png",
  },
  {
    id: 24680,
    status: "Ready",
    items: 1,
    time: "9:45 AM",
    customer: "Caleb",
  image: "/assets/images/order3.png",
  },
];

const statusColors: Record<Order["status"], string> = {
  New: "text-green-700",
  Preparing: "text-yellow-600",
  Ready: "text-gray-600",
};

const buttonText: Record<Order["status"], string> = {
  New: "Mark as Preparing",
  Preparing: "Ready",
  Ready: "Completed",
};

export default function OrderList() {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-lg md:text-2xl font-semibold mb-6">Today</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border p-4 shadow-sm bg-white"
          >
            {/* Left Section */}
            <div className="flex items-start md:items-center space-x-4 flex-1">
              <Image
                src={order.image}
                alt={`Order #${order.id}`}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <p className={`${statusColors[order.status]} text-sm font-medium`}>
                  {order.status}
                </p>
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  {order.items} item{order.items > 1 ? "s" : ""} · {order.time} ·{" "}
                  {order.customer}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium hover:bg-green-100 transition"
              >
                <span>{buttonText[order.status]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
