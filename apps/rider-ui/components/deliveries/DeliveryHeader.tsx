import { ArrowLeft } from "lucide-react";

export default function DeliveryHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center bg-card-light dark:bg-card-dark p-4 border-b">
      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <ArrowLeft size={20} />
      </button>
      <h2 className="flex-1 text-center text-lg font-bold pr-10">
        My Deliveries
      </h2>
    </header>
  );
}
