import { Order } from "@/types/map"

interface Props {
  order: Order
  onAccept: () => void
  onDecline: () => void
}

export default function OrderPreviewSheet({
  order,
  onAccept,
  onDecline,
}: Props) {
  return (
    <div className="absolute bottom-0 w-full max-w-md mx-auto bg-white rounded-t-2xl p-4">
      <h3 className="font-bold text-lg">{order.vendor}</h3>
      <p className="text-gray-500">
        {order.distance} • {order.eta}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 border rounded-xl py-3"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 bg-green-600 text-white rounded-xl py-3"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
