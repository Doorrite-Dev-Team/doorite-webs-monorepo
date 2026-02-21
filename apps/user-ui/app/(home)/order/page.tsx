import { Suspense } from "react";
import OrdersClient from "@/components/order/OrdersClient";
import OrdersPageSkeleton from "@/components/order/OrdersPageSkeleton";
import { Metadata } from "next";

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

  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersClient initialPage={page} initialStatus={status} />
    </Suspense>
  );
}
