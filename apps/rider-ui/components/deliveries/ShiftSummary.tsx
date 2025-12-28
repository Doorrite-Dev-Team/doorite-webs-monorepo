import { ChartLineIcon } from 'lucide-react'

export default function ShiftSummary() {
  return (
    <div className="fixed bg-gray-50 bottom-[87px] left-0 right-0 max-w-md mx-auto">
      <div className="bg-card-light dark:bg-card-dark border-t p-4 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase text-gray-500">Today's Shift</p>
            <p className="text-2xl font-bold">$45.50</p>
            <p className="text-sm text-gray-500">5 deliveries</p>
          </div>
          <button className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ChartLineIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
