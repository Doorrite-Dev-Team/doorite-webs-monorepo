type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export default function IncomingOrderState({
  onAccept,
  onDecline,
}: Props) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-30 p-4">
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-lg">Chicken Republic - Ikeja</h3>
        <p className="text-sm text-gray-500">2.4 km • ₦900 • 15 min</p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onDecline}
            className="border rounded-xl py-3 font-bold"
          >
            Decline
          </button>

          <button
            onClick={onAccept}
            className="bg-primary text-white rounded-xl py-3 font-bold"
          >
            Accept Order
          </button>
        </div>
      </div>
    </div>
  );
}
