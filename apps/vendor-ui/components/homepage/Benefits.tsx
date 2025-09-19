"use client";

import { Users, Store, Bike, Globe } from "lucide-react";
import BenefitCard from "./BenefitCard";

export default function Benefits() {
  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customers",
      description:
        "Enjoy convenient access to a wide range of products and services, delivered right to your doorstep.",
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Vendors",
      description:
        "Expand your reach and grow your business with our reliable delivery network and marketing support.",
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Riders",
      description:
        "Earn flexible income on your own schedule, delivering orders and contributing to your community.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Society",
      description:
        "We’re committed to sustainability and social responsibility, creating positive impact through our operations.",
    },
  ];

  return (
    <section className="px-6 md:px-16 py-12 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Benefits for Everyone
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, idx) => (
          <BenefitCard
            key={idx}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
          />
        ))}
      </div>
    </section>
  );
}
