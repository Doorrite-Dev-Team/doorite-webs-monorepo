// import DeliveryHeader from "@/components/deliveries/DeliveryHeader";
import DeliveryTabs from "@/components/deliveries/DeliveryTabs";
import PriorityDeliveryCard from "@/components/deliveries/PriorityDeliveryCard";
import ActiveDeliveryCard from "@/components/deliveries/ActiveDeliveryCard";
import DeliveryFilters from "@/components/deliveries/DeliveryFilters";
import ShiftSummary from "@/components/deliveries/ShiftSummary";

export default function DeliveriesPage() {
  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark">
      {/* <DeliveryHeader /> */}
      <DeliveryTabs />

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-bold">Priority Queue</h3>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
              High Urgency
            </span>
          </div>

          <PriorityDeliveryCard />
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold">Active Queue (2)</h3>
          <DeliveryFilters />
          <ActiveDeliveryCard />
          <ActiveDeliveryCard variant="confirmed" />
        </section>
      </main>

      <ShiftSummary />
    </div>
  );
}
