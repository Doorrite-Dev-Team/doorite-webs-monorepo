import { Suspense } from "react";
import { notFound } from "next/navigation";
import OrderTrackingClient from "@/components/orders/OrderTrackingClient";
import OrderTrackingSkeleton from "@/components/orders/OrderTrackingSkeleton";
import { Metadata } from "next";
import { serverApi } from "@/libs/api-server";

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
