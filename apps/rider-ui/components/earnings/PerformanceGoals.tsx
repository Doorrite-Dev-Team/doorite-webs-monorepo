export default function PerformanceGoals() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold">Performance & Goals</h3>
        <button className="text-primary text-sm font-semibold">View All</button>
      </div>

      <div className="flex gap-3 overflow-x-auto snap-x">
        {/* Daily Goal */}
        <div className="min-w-[200px] bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm snap-start">
          <p className="text-xs text-slate-400">Daily Goal</p>
          <p className="font-bold">8 / 10 Done</p>
          <div className="h-2 bg-slate-100 rounded-full mt-3">
            <div className="h-2 bg-primary rounded-full w-[80%]" />
          </div>
          <p className="text-xs text-primary mt-2">+2 more for bonus</p>
        </div>

        {/* Bonus Target */}
        <div className="min-w-[200px] bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm snap-start">
          <p className="text-xs text-slate-400">Bonus Target</p>
          <p className="font-bold">₦200 / ₦500</p>
          <div className="h-2 bg-slate-100 rounded-full mt-3">
            <div className="h-2 bg-yellow-400 rounded-full w-[40%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
