"use client";

import Image from "next/image";
import { Store, User } from "lucide-react";
import {
  iconAccount,
  iconPackage,
  iconMotocycle,
  iconWeb,
} from "@repo/ui/assets";

export default function Benefits() {
  const benefits = [
    {
      name: "Customers",
      description:
        "Enjoy convenient access to a wide range of products and services, delivered right to your doorstep.",
      icon: iconAccount,
      renderIcon: <User size={24} className="mb-2" />,
    },
    {
      name: "Vendors",
      description:
        "Expand your reach and grow your business with our reliable delivery network and marketing support.",
      icon: iconPackage,
      renderIcon: <Store size={24} className="mx-auto mb-2" />,
    },
    {
      name: "Riders",
      description:
        "Earn flexible income on your own schedule, delivering orders and contributing to your community.",
      icon: iconMotocycle,
    },
    {
      name: "Society",
      description:
        "We're committed to sustainability and social responsibility, creating positive impact through our operations.",
      icon: iconWeb,
    },
  ];

  return (
    <section id="benefits" className="w-full px-6 md:px-16 py-16 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        Benefits for Everyone
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.name}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-800 text-white text-center"
          >
            {benefit.renderIcon ? (
              benefit.renderIcon
            ) : (
              <Image
                src={benefit.icon}
                alt={`${benefit.name} Icon`}
                width={24}
                height={24}
                className="mx-auto mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{benefit.name}</h3>
            <p className="text-sm text-gray-200 mt-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
