"use client";

const testimonials = [
  {
    name: "Sarah M.",
    feedback:
      "Doorrite has made my life so much easier! I can get groceries delivered in minutes.",
  },
  {
    name: "David L.",
    feedback:
      "As a restaurant owner, Doorrite has helped me reach more customers and increase sales.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 md:px-16 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">What People Say</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700 italic">“{t.feedback}”</p>
            <p className="mt-4 font-semibold text-gray-900">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
