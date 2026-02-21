import { Store, MapPin, Timer } from "lucide-react";

export default function PriorityDeliveryCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-card-light dark:bg-card-dark ring-2 ring-primary/30 shadow-lg">
      {/* Status */}
      <div className="flex justify-between items-center bg-primary/10 p-3">
        <span className="text-primary text-xs font-bold uppercase">
          Next Priority
        </span>
        <span className="text-xs font-bold">Picking Up</span>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-32 bg-gray-300 dark:bg-gray-700">
        <div className="absolute bottom-2 left-3 text-xs bg-black/50 text-white px-2 py-1 rounded">
          1.2 mi to pickup
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-bold">Order #4420</p>
            <p className="text-sm text-gray-500">Starbucks • 2 items</p>
          </div>
          <div className="text-right">
            <p className="text-primary text-xl font-bold">$8.50</p>
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Timer size={14} /> 12 min left
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Store size={18} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase text-gray-400 font-bold">Pickup</p>
              <p className="text-sm">Starbucks Coffee</p>
            </div>
          </div>

          <div className="flex gap-2">
            <MapPin size={18} className="text-gray-400" />
            <div>
              <p className="text-xs uppercase text-gray-400 font-bold">
                Drop-off
              </p>
              <p className="text-sm">Office Complex A</p>
            </div>
          </div>
        </div>

        <button className="w-full h-12 bg-primary text-white rounded-full font-bold">
          Track Order
        </button>
      </div>
    </div>
  );
}
