"use client";

import { Button } from "@repo/ui/components/button";
import QRCode from "react-qr-code";

export function DeliveryQrDisplay({
  qrValue,
  setShowQrScannerAction,
}: {
  qrValue: string;
  setShowQrScannerAction: (v: boolean) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">
        Scan Rider QR Code to Confirm Delivery
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Position the QR code within the frame to scan and verify the delivery.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center mb-6 bg-gray-50">
        <QRCode
          value={qrValue}
          size={200}
          className="w-auto h-auto"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button
          className="flex-1/2"
          variant="outline"
          onClick={() => setShowQrScannerAction(false)}
        >
          Close
        </Button>
        <Button
          className="flex-1/2"
          onClick={() => {
            setShowQrScannerAction(false);
            alert("Pickup Verified!");
          }}
        >
          Pickup Verified!
        </Button>
      </div>
    </div>
  );
}
