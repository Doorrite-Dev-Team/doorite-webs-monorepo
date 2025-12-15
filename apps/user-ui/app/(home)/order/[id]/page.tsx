import { Suspense } from "react";
import { notFound } from "next/navigation";
import OrderTrackingClient from "@/components/orders/OrderTrackingClient";
import OrderTrackingSkeleton from "@/components/orders/OrderTrackingSkeleton";
import { Metadata } from "next";
import { api as serverApi } from "@/actions/api";
// import { revalidateCache } from "@/libs/api/revalidator";

// import { api } from "@/actions/api";

// Server-side data fetching
// async function getOrderDetails(orderId: string): Promise<Order | null> {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
//       {
//         next: { revalidate: 10 }, // Revalidate every 10 seconds for real-time updates
//         credentials: "include",
//       },
//     );

//     if (!response.ok) return null;

//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error("Failed to fetch order:", error);
//     return null;
//   }
// }

// Metadata generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await serverApi.fetchOrder(id);

  if (!order) {
    return {
      title: "Order Not Found",
    };
  }

  return {
    title: `Order #${order.id.slice(-8)} - Track Your Order`,
    description: `Track your order status and delivery`,
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await serverApi.fetchOrder(id);

  if (!order) {
    notFound();
  }

  // revalidateCache.order(id);

  return (
    <Suspense fallback={<OrderTrackingSkeleton />}>
      <OrderTrackingClient order={order} />
    </Suspense>
  );
}
