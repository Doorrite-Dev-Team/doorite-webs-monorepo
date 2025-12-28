import OrderList from "@/components/order/OrderList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrderPage() {
  return <OrderList />;
}
