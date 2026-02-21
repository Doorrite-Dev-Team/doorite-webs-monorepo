export default function DeliveryFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {["Smart Filter", "Distance", "Earnings"].map((f) => (
        <button
          key={f}
          className="shrink-0 px-4 h-9 rounded-full border bg-white dark:bg-gray-800 text-xs font-bold"
        >
          {f}
        </button>
      ))}
    </div>
  );
}
