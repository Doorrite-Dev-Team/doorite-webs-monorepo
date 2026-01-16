// app/orders/page.tsx
import { Metadata } from "next";
import OrdersClient from "@/components/order/OrdersClient";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrderPage() {
  return <OrdersClient />;
}
