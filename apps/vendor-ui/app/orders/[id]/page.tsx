
import OrderDetailsPage from "@/components/order/OrderDetailsPage";
import OrdersLayoutClient from "@/components/order/OrdersLayoutClient";

export default function OrderPage() {
  return (
    <OrdersLayoutClient>
      <OrderDetailsPage />
    </OrdersLayoutClient>
  );
}
