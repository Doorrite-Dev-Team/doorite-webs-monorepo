export default function EarningsBreakdown() {
  return (
    <section className="bg-white dark:bg-surface-dark p-5 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Breakdown</h3>

        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1">
          <button className="px-3 py-1 bg-white dark:bg-surface-dark rounded-full text-xs font-bold">
            Daily
          </button>
          <button className="px-3 py-1 text-xs text-slate-400">Weekly</button>
          <button className="px-3 py-1 text-xs text-slate-400">Monthly</button>
        </div>
      </div>

      {/* Chart stays SVG-based (same as your HTML) */}
      <div className="h-40 w-full">
        {/* Keep your SVG chart here */}
      </div>
    </section>
  );
}
