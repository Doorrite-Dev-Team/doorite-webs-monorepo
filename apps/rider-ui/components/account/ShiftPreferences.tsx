import { ChevronDownIcon } from "lucide-react";


export function ShiftPreferences() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase">
        Shift Preferences
      </h3>

      <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-card flex flex-col gap-5">
        {/* Availability */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">
            Availability Hours
          </p>
          <div className="flex gap-3 items-center">
            <button className="flex-1 items-center border rounded-lg p-3 flex justify-between">
              09:00 AM
              <ChevronDownIcon className="h-4 w-5"/>
            </button>
            <span className="text-gray-400">to</span>
            <button className="flex-1 items-center border rounded-lg p-3 flex justify-between">
              05:00 PM
              <ChevronDownIcon className="h-4 w-5"/>
            </button>
          </div>
        </div>

        {/* Preferred Workdays */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">
            Preferred Workdays
          </p>
          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-full text-xs font-bold ${
                  i < 5
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-400"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
