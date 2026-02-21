"use client";

import { Back, Delivery } from "@/public/assets/icons";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import DeliveryDetailsModal from "./DeliveryDetailsModal";

interface UpcomingDeliveriesModalProps {
  show: boolean;
  onClose: () => void;
}

const deliveries = [
  {
    id: "12345",
    from: "123 Main St",
    to: "456 Oak Ave",
    amount: 15.5,
    vendor: "Vendor A",
    vendorAddress: "123 Main St, Anytown",
    customer: "Customer A",
    orderId: "12345",
    deliveryAddress: "456 Oak Ave, Anytown",
  },
  {
    id: "67890",
    from: "789 Pine St",
    to: "101 Elm St",
    amount: 12.75,
    vendor: "Vendor B",
    vendorAddress: "789 Pine St, Anytown",
    customer: "Customer B",
    orderId: "67890",
    deliveryAddress: "101 Elm St, Anytown",
  },
  {
    id: "54321",
    from: "222 Maple Rd",
    to: "987 Birch Ln",
    amount: 20.0,
    vendor: "Vendor C",
    vendorAddress: "222 Maple Rd, Anytown",
    customer: "Customer C",
    orderId: "54321",
    deliveryAddress: "987 Birch Ln, Anytown",
  },
  {
    id: "11223",
    from: "12 Cedar Blvd",
    to: "34 Spruce Ct",
    amount: 9.99,
    vendor: "Vendor D",
    vendorAddress: "12 Cedar Blvd, Anytown",
    customer: "Customer D",
    orderId: "11223",
    deliveryAddress: "34 Spruce Ct, Anytown",
  },
  {
    id: "44556",
    from: "55 Willow Way",
    to: "88 Poplar Dr",
    amount: 18.25,
    vendor: "Vendor E",
    vendorAddress: "55 Willow Way, Anytown",
    customer: "Customer E",
    orderId: "44556",
    deliveryAddress: "88 Poplar Dr, Anytown",
  },
];

export default function UpcomingDeliveriesModal({
  show,
  onClose,
}: UpcomingDeliveriesModalProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleOpenDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    onClose(); // close UpcomingDeliveriesModal
    setTimeout(() => setShowDetails(true), 200); // wait for transition
  };

  return (
    <>
      {/* Upcoming Deliveries Modal */}
      <Transition show={show} as={Fragment}>
        <Dialog className="relative z-10" onClose={onClose}>
          {/* Backdrop */}
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </TransitionChild>

          {/* Panel */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex justify-end">
              <TransitionChild
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="relative w-full max-w-md h-full bg-[#F7FAF7] shadow-xl overflow-y-scroll hide-scrollbar rounded-xl">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <button onClick={onClose}>
                        <Back className="w-6 h-6 text-gray-700" />
                      </button>
                      <h2 className="text-lg font-semibold text-center flex-1">
                        My Deliveries
                      </h2>
                      <div className="w-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold mb-4">
                      Upcoming Deliveries
                    </h3>

                    {/* Delivery list */}
                    <div className="space-y-4">
                      {deliveries.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => handleOpenDetails(d)}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-green-50 transition"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Delivery className="w-6 h-6 text-green-700" />
                            </div>
                            <div>
                              <p className="font-medium">Delivery #{d.id}</p>
                              <p className="text-sm text-green-700">
                                {d.from} to {d.to}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">
                            ${d.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delivery Details Modal */}
      <DeliveryDetailsModal
        show={showDetails}
        onClose={() => setShowDetails(false)}
        delivery={selectedDelivery}
      />
    </>
  );
}
