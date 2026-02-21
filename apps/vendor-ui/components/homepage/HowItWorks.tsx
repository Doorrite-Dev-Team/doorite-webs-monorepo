"use client";

const steps = [
  {
    title: "Browse & Order",
    description:
      "Customers explore local businesses and place orders through our app or website.",
  },
  {
    title: "Prepare & Dispatch",
    description:
      "Vendors receive orders, prepare items, and dispatch them with our delivery partners.",
  },
  {
    title: "Enjoy Delivery",
    description:
      "Customers track their orders in real-time and receive their items with a smile.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 md:px-16 py-12 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
