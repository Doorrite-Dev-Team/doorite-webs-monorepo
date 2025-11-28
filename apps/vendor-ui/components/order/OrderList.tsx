"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  status: "New" | "Preparing" | "Ready" | "Completed";
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

const stats = [
  { label: "Active", value: 12, percentage: "+10%", color: "text-green-700" },
  {
    label: "Completed",
    value: 150,
    percentage: "+5%",
    color: "text-green-700",
  },
  { label: "Pending", value: 5, percentage: "-2%", color: "text-red-600" },
  { label: "Cancelled", value: 2, percentage: "-1%", color: "text-red-600" },
];

const statusColors: Record<Order["status"], string> = {
  New: "text-green-700",
  Preparing: "text-yellow-600",
  Ready: "text-gray-700",
  Completed: "text-green-600",
};

const buttonText: Record<Order["status"], string> = {
  New: "Mark as Preparing",
  Preparing: "Ready",
  Ready: "Completed",
  Completed: "Completed",
};

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F6F7F6] p-4 md:p-10">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-white rounded-xl px-5 py-5 shadow-sm border flex flex-col"
          >
            <p className="text-gray-600 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className={`text-sm mt-1 ${s.color}`}>{s.percentage}</p>
          </div>
        ))}
      </div>

      {/* Today */}
      <h2 className="text-lg md:text-2xl font-semibold mb-6">Today</h2>

      <div className="space-y-6 mb-12">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm border p-4 md:p-6 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
              <Image
                src={order.image}
                alt="order"
                width={110}
                height={110}
                className="rounded-lg object-cover w-28 h-28 md:w-32 md:h-32"
              />

              <div>
                <p
                  className={`${statusColors[order.status]} text-sm font-semibold`}
                >
                  {order.status}
                </p>

                <p className="font-semibold text-xl">Order #{order.id}</p>

                <p className="text-gray-600 text-sm mt-1">
                  {order.items} item{order.items > 1 ? "s" : ""} • {order.time}{" "}
                  • {order.customer}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 text-green-700 font-medium hover:bg-green-100 transition">
                <span>{buttonText[order.status]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-lg md:text-2xl font-semibold mb-6">Recent Orders</h2>

      <div className="space-y-4 mb-20">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <p className="font-medium text-gray-900">{order.customer}</p>
                <p className="text-gray-500 text-sm">Order ID: #{order.id}</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/orders/${order.id}`)}
              className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm hover:bg-green-100 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
