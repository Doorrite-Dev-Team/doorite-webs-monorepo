"use client";

import { Route } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ContinueAs() {
  const router = useRouter();

  const roles = [
    {
      title: "Vendor",
      description: "Manage your store and orders.",
      image: "/assets/images/vendor.png",
      route: "/login",
    },
    {
      title: "Rider",
      description: "Deliver orders and earn.",
      image: "/assets/images/rider.png",
      route: "/login",
    },
    {
      title: "Customer",
      description: "Order food and groceries.",
      image: "/assets/images/customers.png",
      route: "/login",
    },
  ];

  return (
    <section className="bg-white min-h-screen px-6 py-10 md:px-20 md:py-16">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 text-center">
        Continue as…
      </h1>
      <p className="text-gray-600 text-center mt-2 mb-10">
        Choose your role to proceed with the app.
      </p>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between md:flex-col md:justify-start md:text-center border rounded-xl shadow-sm hover:shadow-md transition bg-white p-5"
          >
            {/* Text Section */}
            <div className="flex-1 md:order-2 md:mt-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {role.title}
              </h2>
              <p className="text-green-600 text-sm mt-1">{role.description}</p>
              <button
                onClick={() => router.push(role.route as Route<string>)}
                className="mt-4 bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Select →
              </button>
            </div>

            {/* Image */}
            <div className="flex-shrink-0 md:order-1">
              <Image
                src={role.image}
                alt={role.title}
                width={100}
                height={100}
                className="w-24 h-24 object-contain mx-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
