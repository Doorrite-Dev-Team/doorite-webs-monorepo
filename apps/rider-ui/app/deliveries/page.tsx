
import DeliveriesLayoutClient from "@/components/deliveries/DeliveriesLayoutClient";
// import DeliveriesList from "@/components/deliveries/DeliveriesList";
import DeliveriesPage from "@/components/deliveries/Delivery";

export default function OrderPage() {
  return (
    <DeliveriesLayoutClient>
      {/* <DeliveriesList /> */}
      <DeliveriesPage />
    </DeliveriesLayoutClient>
  );
}
