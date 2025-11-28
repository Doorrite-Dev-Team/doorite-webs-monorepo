"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MoreVertical } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F6F7F6] p-4 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold">Order Details</h1>
      </div>

      {/* CUSTOMER DETAILS */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Customer Details</h2>

        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <Image
            src="/assets/images/user1.png"
            width={60}
            height={60}
            alt="Customer"
            className="rounded-full"
          />

          <div>
            <p className="font-semibold text-gray-900">Sophia Clark</p>
            <p className="text-green-700">(555) 123–4567</p>
          </div>
        </div>
      </section>

      {/* ORDER BREAKDOWN */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Order Breakdown</h2>

        <div className="space-y-4">
          {[
            {
              name: "Spicy Chicken Sandwich",
              qty: 2,
              img: "/assets/images/orderimg1.png",
            },
            { name: "Fries", qty: 1, img: "/assets/images/orderimg2.png" },
            { name: "Coke", qty: 1, img: "/assets/images/orderimg3.png" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border"
            >
              <Image
                src={item.img}
                width={70}
                height={70}
                alt={item.name}
                className="rounded-lg object-cover"
              />

              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-green-700 text-sm">Quantity: {item.qty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER TIMELINE */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>

        <div className="relative ml-4">
          {/* Vertical Line */}
          <div className="absolute top-4 left-2 w-[2px] h-full bg-green-200"></div>

          {[
            { label: "Order Placed", time: "9:30 AM", done: true },
            { label: "Preparing", time: "9:45 AM", done: true },
            { label: "Ready", time: "10:20 AM", done: true },
            { label: "Out for Delivery", time: "10:25 AM", done: false },
            { label: "Completed", time: "", done: false },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4 mb-6">
              {/* Circle */}
              <div
                className={`w-4 h-4 rounded-full mt-1 ${
                  step.done ? "bg-green-600" : "border-2 border-gray-400"
                }`}
              ></div>

              {/* Text */}
              <div>
                <p className="text-gray-800 font-medium">{step.label}</p>
                {step.time && (
                  <p className="text-green-700 text-sm">{step.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ASSIGNED RIDER */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold mb-3">Assigned Rider</h2>

        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/images/rider.png"
              width={55}
              height={55}
              alt="Rider"
              className="rounded-full"
            />

            <div>
              <p className="font-medium text-gray-900">Live Location</p>
              <p className="text-green-700 text-sm">Rider: Ethan Carter</p>
            </div>
          </div>

          <button className="p-3 bg-green-700 text-white rounded-lg">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="space-y-3 max-w-md mx-auto mb-16">
        <button className="w-full bg-yellow-400 py-3 rounded-xl font-medium hover:bg-yellow-500 transition">
          Mark as Preparing
        </button>

        <button className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition">
          Mark as Ready
        </button>

        <button
          onClick={() => router.push(`/orders/${id}/chat`)}
          className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-medium hover:bg-green-200 transition"
        >
          Contact Rider
        </button>
      </div>
    </div>
  );
}
