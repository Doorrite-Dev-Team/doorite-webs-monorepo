// "use client"
// import { MessageSquare } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { } from 'react';
// import { order, orders } from '@/libs/contant';
// import { formatDate, formatTime, getStatusColor, getStatusText } from '@/libs/helper';

// export default function OrderTrackingSystem() {
//   const sortedOrders = orders.sort(
//     (a: order, b: order) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
//   );

//   const router = useRouter()
//   return (
//     <div className="max-w-2xl mx-auto min-h-screen">
//       <div className="p-4">
//         {/* Orders List */}
//         <div className="space-y-4">
//           {sortedOrders.map((order: order) => (
//             <div
//               key={order.id}
//               onClick={() => router.push(`/orders/${order.id}`)}
//               className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//             >
//               {/* Order Header */}
//               <div className="flex items-center justify-between mb-3">
//                 <span className="font-medium text-gray-900">#{order.id}</span>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
//                 >
//                   {getStatusText(order.status)}
//                 </span>
//               </div>

//               {/* Order Items */}
//               <div className="mb-3">
//                 <p className="text-gray-600 text-sm">
//                   {order.items.slice(0, 2).join(", ")}
//                   {order.items.length > 2 && ` +${order.items.length - 2} more`}
//                 </p>
//               </div>

//               {/* Order Info */}
//               <div className="flex items-center justify-between text-sm">
//                 <div className="text-gray-500">
//                   <span>
//                     {formatDate(order.orderTime)} •{" "}
//                     {formatTime(order.orderTime)}
//                   </span>
//                 </div>
//                 <div className="font-semibold text-gray-900">
//                   ${order.total.toFixed(2)}
//                 </div>
//               </div>

//               {/* Estimated Delivery (for active orders) */}
//               {!["delivered", "cancelled"].includes(order.status) && (
//                 <div className="mt-2 text-sm text-green-600">
//                   Est. delivery: {formatTime(order.estimatedDelivery)}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Empty State (if no orders) */}
//         {sortedOrders.length === 0 && (
//           <div className="text-center py-12">
//             <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No orders yet
//             </h3>
//             <p className="text-gray-500">Your order history will appear here</p>
//           </div>
//         )}
//       </div>

//       {/* Bottom Navigation
//       <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t">
//         <div className="flex">
//           <button className="flex-1 flex flex-col items-center py-3 text-gray-400">
//             <Home className="w-5 h-5 mb-1" />
//             <span className="text-xs">Home</span>
//           </button>
//           <button className="flex-1 flex flex-col items-center py-3 text-gray-400">
//             <Search className="w-5 h-5 mb-1" />
//             <span className="text-xs">Search</span>
//           </button>
//           <button className="flex-1 flex flex-col items-center py-3 text-green-600">
//             <MessageSquare className="w-5 h-5 mb-1" />
//             <span className="text-xs">Orders</span>
//           </button>
//           <button className="flex-1 flex flex-col items-center py-3 text-gray-400">
//             <User className="w-5 h-5 mb-1" />
//             <span className="text-xs">Account</span>
//           </button>
//         </div>
//       </div> */}
//     </div>
//   );
// }

"use client";
import { OrdersList } from "@/components/order";
import { orders } from "@/libs/contant";
import { MessageSquare } from "lucide-react";

export default function OrderTrackingPage() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <div className="p-4">
        <p className="text-xl text-primary font-semibold mb-4">Recent Orders</p>
        <OrdersList orders={orders} />

        {orders.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
