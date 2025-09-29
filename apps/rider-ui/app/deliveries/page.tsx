
import DeliveriesLayoutClient from "@/components/deliveries/DeliveriesLayoutClient";
import DeliveriesList from "@/components/deliveries/DeliveriesList";

export default function OrderPage() {
  return (
    <DeliveriesLayoutClient>
      <DeliveriesList />
    </DeliveriesLayoutClient>
  );
}
