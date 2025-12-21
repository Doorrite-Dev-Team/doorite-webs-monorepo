import { Suspense } from "react";
import OrdersClient from "@/components/order/OrdersClient";
import OrdersPageSkeleton from "@/components/order/OrdersPageSkeleton";
import { Metadata } from "next";
import { api } from "@/actions/api";
// import { revalidateCache } from "@/libs/api/revalidator";

// Fetch user orders

// Metadata
export const metadata: Metadata = {
  title: "My Orders - Order History",
  description: "View and track your orders",
};

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: OrderStatus;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const status = params.status;

  const { orders, pagination } = await api.fetchOrders(page, status);
  // revalidateCache.orders();

  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersClient
        initialOrders={orders}
        initialPagination={pagination}
        initialStatus={status}
      />
    </Suspense>
  );
}

// // "use client";
// import { OrdersList } from "@/components/order/order-card";
// // import { orders } from "@/libs/contant";
// import { MessageSquare } from "lucide-react";

// export default async function OrdersPage() {
//   const order = [];
//   return (
//     <div className="max-w-2xl mx-auto min-h-screen">
//       <div className="p-4">
//         <p className="text-xl text-primary font-semibold mb-4">Recent Orders</p>
//         <OrdersList orders={orders} />

//         {orders.length === 0 && (
//           <div className="text-center py-12">
//             <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No orders yet
//             </h3>
//             <p className="text-gray-500">Your order history will appear here</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
