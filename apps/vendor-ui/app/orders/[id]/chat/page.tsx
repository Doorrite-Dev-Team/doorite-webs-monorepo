
import OrderChatPage from "@/components/order/OrderChatPage";
import OrdersLayoutClient from "@/components/order/OrdersLayoutClient";

export default function OrderPage() {
  return (
    <OrdersLayoutClient>
      <OrderChatPage />
    </OrdersLayoutClient>
  );
}
