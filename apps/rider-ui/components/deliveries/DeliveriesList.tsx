"use client";

import Image from "next/image";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import UpcomingDeliveriesModal from "./UpcomingDeliveriesModal";

interface Delivery {
  id: number;
  type: "Pickup" | "Dropoff" | "Items";
  time: string;
  title: string;
  subtitle: string;
  extra?: string;
  button: string;
  buttonIcon?: "arrow" | "check" | "alert";
  image: string;
}

const deliveries: Delivery[] = [
  {
    id: 1,
    type: "Pickup",
    time: "12:30 PM",
    title: "The Daily Grind",
    subtitle: "123 Main St",
    button: "Start Delivery",
    buttonIcon: "arrow",
    image: "/assets/images/delivery1.png",
  },
  {
    id: 2,
    type: "Dropoff",
    time: "1:15 PM",
    title: "Sarah's Residence",
    subtitle: "456 Oak Ave",
    button: "Mark as Delivered",
    buttonIcon: "check",
    image: "/assets/images/delivery2.png",
  },
  {
    id: 3,
    type: "Items",
    time: "2 coffees, 1 pastry",
    title: "Estimated Time: 45 mins",
    subtitle: "Distance: 2.5 miles",
    button: "Issue Report",
    buttonIcon: "alert",
    image: "/assets/images/delivery3.png",
  },
];

export default function DeliveriesList() {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-[-webkit-fill-available] bg-[#F9FCF9] flex flex-col">
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              {/* Left Section */}
              <div className="flex-1">
                <p className="text-green-600 text-sm font-medium">
                  {delivery.type}: {delivery.time}
                </p>
                <h3 className="text-lg font-semibold mt-1">{delivery.title}</h3>
                <p className="text-gray-600 text-sm">{delivery.subtitle}</p>

                <button className="mt-3 flex items-center space-x-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium hover:bg-green-100 transition">
                  <span>{delivery.button}</span>
                  {delivery.buttonIcon === "arrow" && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {delivery.buttonIcon === "check" && (
                    <Check className="w-4 h-4" />
                  )}
                  {delivery.buttonIcon === "alert" && (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Right Section */}
              <Image
                src={delivery.image}
                alt={delivery.title}
                width={100}
                height={80}
                className="rounded-lg ml-4"
              />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="p-4 md:px-8 md:pb-8" onClick={() => setOpen(true)}>
        <button className="w-full py-4 rounded-full bg-green-700 text-white font-semibold text-lg hover:bg-green-800 transition">
          Upcoming Deliveries
        </button>
      </div>
      <UpcomingDeliveriesModal show={open} onClose={() => setOpen(false)} />
    </div>
  );
}
