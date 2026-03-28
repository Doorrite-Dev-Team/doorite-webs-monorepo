"use client";

import Image from "next/image";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import UpcomingDeliveriesModal from "@/components/deliveries/UpcomingDeliveriesModal";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

interface Delivery {
  id: number;
  type: "Pickup" | "Dropoff" | "Items";
  time: string;
  title: string;
  subtitle: string;
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

export default function DeliveriesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-green-600 text-sm font-medium">
                    {delivery.type}: {delivery.time}
                  </p>
                  <h3 className="text-lg font-semibold mt-1">
                    {delivery.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{delivery.subtitle}</p>
                  <Button className="mt-3 bg-green-600 hover:bg-green-700">
                    {delivery.button}
                    {delivery.buttonIcon === "arrow" && (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                    {delivery.buttonIcon === "check" && (
                      <Check className="w-4 h-4 ml-2" />
                    )}
                    {delivery.buttonIcon === "alert" && (
                      <AlertTriangle className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </div>
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <Image
                    src={delivery.image}
                    alt={delivery.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={() => setModalOpen(true)}
      >
        View Upcoming Deliveries
      </Button>

      <UpcomingDeliveriesModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
