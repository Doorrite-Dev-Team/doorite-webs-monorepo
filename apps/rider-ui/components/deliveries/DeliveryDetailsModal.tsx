"use client";

import { Back, Scan } from "@/public/assets/icons";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
// import { Scan } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

interface Delivery {
  id: string;
  vendor: string;
  vendorAddress: string;
  customer: string;
  orderId: string;
  deliveryAddress: string;
}

interface DeliveryDetailsModalProps {
  show: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

export default function DeliveryDetailsModal({
  show,
  onClose,
  delivery,
}: DeliveryDetailsModalProps) {
  if (!delivery) return null;

  return (
    <Transition show={show} as={Fragment}>
      <Dialog className="relative z-20" onClose={onClose}>
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
              <DialogPanel className="relative w-full max-w-md h-full bg-[#F7FAF7] shadow-xl overflow-y-auto hide-scrollbar rounded-xl">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={onClose}>
                      <Back className="w-6 h-6 text-gray-700" />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-1">
                      Delivery
                    </h2>
                    <div className="w-6" />
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <p className="text-sm font-medium">Pickup</p>
                    <div className="w-full h-2 bg-green-100 rounded-full mt-1">
                      <div className="h-2 bg-green-600 rounded-full w-1/4" />
                    </div>
                    <p className="text-sm text-green-700 mt-1">1/4</p>
                  </div>

                  {/* Vendor */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">🏬</div>
                    <div>
                      <p className="font-medium">{delivery.vendor}</p>
                      <p className="text-sm text-green-700">
                        {delivery.vendorAddress}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <h3 className="text-base font-semibold mb-4">
                    Order Details
                  </h3>

                  {/* Customer */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src="/assets/images/customer.png"
                      alt="Customer"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{delivery.customer}</p>
                      <p className="text-sm text-green-700">
                        Order #{delivery.orderId}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">📍</div>
                    <div>
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-sm text-green-700">
                        {delivery.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <button className="bg-green-700 text-white px-4 py-2 rounded-full font-medium">
                      Call Customer
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            delivery.deliveryAddress
                          )}`,
                          "_blank"
                        )
                      }
                      className="bg-green-100 px-4 py-2 rounded-full font-medium"
                    >
                      Directions
                    </button>
                  </div>

                  {/* QR Button */}
                  <div className="flex justify-end mt-10">
                    <button className="bg-green-900 text-white p-3 rounded-lg">
                      <Scan className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
