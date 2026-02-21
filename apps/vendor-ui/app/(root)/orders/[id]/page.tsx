// app/orders/[id]/page.tsx
import { Metadata } from "next";
import OrderDetailsClient from "@/components/order/OrderDetailsClient";

export const metadata: Metadata = {
  title: "Order Details",
};

export default function OrderDetailsPage() {
  return <OrderDetailsClient />;
}
