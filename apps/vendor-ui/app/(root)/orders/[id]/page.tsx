import OrderDetailsPage from "@/components/order/OrderDetailsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
};

export default function OrderPage() {
  return <OrderDetailsPage />;
}
