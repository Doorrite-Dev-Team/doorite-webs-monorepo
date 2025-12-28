import { Order } from "@/types/map"

export default function NavigationHUD({ order }: { order: Order }) {
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="absolute top-4 inset-x-4 bg-white rounded-2xl p-3 shadow">
        <p className="font-bold">200m • Turn right</p>
        <p className="text-sm text-gray-500">
          Heading to customer
        </p>
      </div>

      {/* Bottom Action Sheet */}
      <div className="absolute bottom-0 w-full max-w-md mx-auto bg-white rounded-t-3xl p-4">
        <h2 className="font-bold text-xl">Order #{order.id}</h2>
        <button className="mt-4 w-full bg-green-600 text-white py-4 rounded-2xl">
          Mark Arrived
        </button>
      </div>
    </>
  )
}
