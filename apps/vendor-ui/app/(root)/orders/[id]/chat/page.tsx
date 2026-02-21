import OrderChatPage from "@/components/order/OrderChatPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Chat",
};

export default function OrderPage() {
  return <OrderChatPage />;
}
