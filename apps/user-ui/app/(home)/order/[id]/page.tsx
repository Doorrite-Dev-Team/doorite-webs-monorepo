"use client";
import { use, useState } from "react";

// app/order/[id]/page.tsx
import { DeliveryQrDisplay } from "@/components/qr-code-display";
import { TrackYourOrder } from "@/components/home/track-order";
import { orders as ORDERS } from "@/libs/contant";
import { formatTime } from "@/libs/helper";
import { Button } from "@repo/ui/components/button";
import { MessageCircle, Phone, QrCode } from "lucide-react";

export type Status =
  | "pending"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const selectedOrder = (ORDERS as Order[]).find((o) => o.id === id);

  if (!selectedOrder) {
    return (
      <div className="max-w-2xl mx-auto bg-white min-h-screen p-6">
        <h2 className="text-xl font-semibold mb-4">Order not found</h2>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find that order.
        </p>
      </div>
    );
  }

  if (showQrScanner)
    return (
      <DeliveryQrDisplay
        qrValue="rider-12345-delivery-code"
        setShowQrScannerAction={setShowQrScanner}
      />
    );

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen relative">
      <div className="p-6">
        {/* Track Your Order map + driver card (imported component) */}
        {selectedOrder.status === "out-for-delivery" && (
          <TrackYourOrder order={selectedOrder} />
        )}

        {/* Estimated delivery */}
        <div className="mt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Estimated delivery
          </h2>
          <div className="text-4xl font-bold text-gray-900">
            {formatTime(selectedOrder.estimatedDelivery)}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <div className="space-y-6">
            {selectedOrder.tracking.map((step, idx) => (
              <div key={idx} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                      step.completed
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>

                  {idx < selectedOrder.tracking.length - 1 && (
                    <div
                      className={`w-[2px] h-10 mt-2 ${step.completed ? "bg-primary" : "bg-gray-300"}`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900">{step.step}</div>
                  <div className="text-primary text-sm">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Details
          </h3>
          <div className="space-y-3">
            {selectedOrder.orderDetails.map((item, i) => (
              <div key={i}>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-primary text-sm">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery Address
          </h3>
          <p className="text-gray-700">{selectedOrder.deliveryAddress}</p>
        </div>

        {/* Support Buttons */}
        <div className="flex gap-4 mb-12">
          <a href={`tel:+0000000000`} className="w-1/2">
            <Button className="w-full rounded-full flex items-center justify-center px-5 py-3 bg-primary text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
          </a>

          <Button
            className="w-1/2 rounded-full flex items-center justify-center px-5 py-3"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </Button>
        </div>

        {/* Scan Qr Button to confirm delivery*/}
        <div className="fixed bottom-40 z-[999] right-2 bg-primary/30 rounded-lg p-3 border-t">
          <Button
            className="h-10 w-10"
            onClick={() => setShowQrScanner(true)}
            variant="outline"
            aria-label="Scan QR Code"
          >
            <QrCode size={30} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// function use(params: { id: Promise<{ slug: string; }>; }): { id: any; } {
//   throw new Error("Function not implemented.");
// }
// function use(params: { id: Promise<{ slug: string; }>; }): { id: any; } {
//   throw new Error("Function not implemented.");
// }
