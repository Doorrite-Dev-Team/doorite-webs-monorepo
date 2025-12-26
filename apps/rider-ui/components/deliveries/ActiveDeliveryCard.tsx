type Props = {
  variant?: "waiting" | "confirmed";
};

export default function ActiveDeliveryCard({ variant = "waiting" }: Props) {
  return (
    <div className="rounded-xl bg-card-light dark:bg-card-dark border p-4 space-y-3">
      <div className="flex justify-between">
        <div>
          <p className="font-bold">Order #4425</p>
          <p className="text-xs font-bold text-amber-500">
            {variant === "waiting" ? "Waiting at Restaurant" : "Confirmed"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-primary font-bold">$5.20</p>
          <p className="text-xs text-gray-500">25 min left</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
        McDonald's → 88 Pine St
      </div>

      <button
        className={`w-full h-10 rounded-full font-bold ${
          variant === "waiting"
            ? "border border-primary text-primary"
            : "border text-gray-500"
        }`}
      >
        {variant === "waiting" ? "Track Order" : "View Details"}
      </button>
    </div>
  );
}
