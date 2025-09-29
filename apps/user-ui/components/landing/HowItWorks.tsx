"use client";

import { Bike, Package, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

export default function HowItWorks() {
  const steps = [
    {
      name: "Browse & Order",
      description:
        "Customers explore local businesses and place orders through our app or website.",
      icon: ShoppingBag,
    },
    {
      name: "Prepare, Pack & Dispatch",
      description:
        "Vendors receive orders, prepare items, pack and dispatch them with our delivery partners.",
      icon: Package,
    },
    {
      name: "Deliver & Enjoy",
      description:
        "Customers track their orders in real-time and receive their items with a smile.",
      icon: Bike,
    },
  ];

  return (
    <section className="px-6 md:px-16 py-12 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Card
              key={i}
              className="bg-yellow-400 rounded-xl p-6 text-center shadow-md border-none hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900 font-bold">
                  {i + 1}
                </div>
                <Icon className="w-8 h-8 text-gray-900 mt-4" />
                <CardTitle className="mt-3 text-lg font-semibold text-gray-900">
                  {step.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">{step.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
