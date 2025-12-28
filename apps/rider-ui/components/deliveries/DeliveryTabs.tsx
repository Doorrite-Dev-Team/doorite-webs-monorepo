export default function DeliveryTabs() {
  return (
    <div className="bg-card-light dark:bg-card-dark px-4 py-3">
      <div className="flex h-12 rounded-full bg-gray-100 dark:bg-gray-800 p-1">
        {["Active Deliveries", "Completed"].map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 rounded-full text-sm font-bold transition ${
              i === 0
                ? "bg-primary text-white shadow"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
