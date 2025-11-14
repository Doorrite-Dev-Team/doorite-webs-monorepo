"use client";

export default function Impact() {
  const stats = [
    { name: "Orders Delivered", count: "10M+" },
    { name: "Active Partners", count: "5K+" },
    { name: "Rider Network", count: "20K+" },
  ];

  return (
    <section className="px-6 md:px-16 py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-yellow-400 rounded-xl p-6 text-center shadow-md"
          >
            <h3 className="text-3xl font-bold text-gray-900">{stat.count}</h3>
            <p className="mt-2 text-gray-800">{stat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
