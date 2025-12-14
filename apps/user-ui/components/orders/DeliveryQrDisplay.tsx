"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { toast } from "@repo/ui/components/sonner";

// Assuming QRCodeGenerator is located here or in a similar path
// You MUST ensure the QRCodeGenerator component is imported correctly
import QRCodeGenerator from "@/components/QrCodeGenerator";
import Axios from "@/libs/Axios";

// --- TYPES ---
interface DeliveryQrDisplayProps {
  orderId: string;
  verificationCode?: string; // The code to be displayed in the QR
  isLoading?: boolean; // Prop to pass down loading state to the Generator
  onClose: () => void;
  onVerified: () => void;
}

// --- API FUNCTION ---
async function verifyDelivery(orderId: string, code: string): Promise<void> {
  // NOTE: This URL construction looks like it assumes the API lives on the same origin or has a globally defined env var.
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response: SuccessResponse = await Axios.post(
    `orders/${orderId}/verify-delivery`,
    { verificationCode: code },
  );

  if (!response.data.ok) {
    // const error = await response.json();
    // Use the error message from the backend if available
    throw new Error(response.message || "Verification failed");
  }
  // No return value needed for success
}

// --- MAIN COMPONENT ---
export default function DeliveryQrDisplay({
  orderId,
  verificationCode,
  isLoading = false,
  onClose,
  onVerified,
}: DeliveryQrDisplayProps) {
  const [manualCode, setManualCode] = React.useState("");
  const [showManualEntry, setShowManualEntry] = React.useState(false);

  const verifyMutation = useMutation({
    mutationFn: (code: string) => verifyDelivery(orderId, code),
    onSuccess: () => {
      toast.success("Order Delivered! 🎉", {
        description: "Your order has been marked as delivered successfully.",
      });
      onVerified();
    },
    onError: (error: Error) => {
      toast.error("Verification Failed", {
        description: error.message,
      });
    },
  });

  const handleManualVerify = () => {
    if (verifyMutation.isPending) return;

    if (!manualCode.trim()) {
      toast("Error", {
        description: "Please enter a verification code",
      });
      return;
    }
    verifyMutation.mutate(manualCode.trim());
  };

  // Use a sensible default value for the QR code if loading is complete but no code is available
  const qrValue = verificationCode || orderId;
  // const isQrReady = !isLoading && !!verificationCode;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Verify Delivery (Order #{orderId.slice(-8).toUpperCase()})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full"
                disabled={verifyMutation.isPending}
                aria-label="Close delivery verification"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content Switch: QR Display or Manual Entry */}
            {!showManualEntry ? (
              <div className="space-y-6">
                {/* Integrated QRCodeGenerator */}
                <QRCodeGenerator
                  value={qrValue}
                  orderId={orderId + " " + manualCode}
                  size={192} // Reduced size for modal view
                  title="Show QR Code to Rider"
                  description="The delivery rider will scan this code to confirm receipt."
                  showActions={true} // Keep actions like Download/Share
                  isLoading={isLoading}
                />

                {/* Manual Entry Option */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowManualEntry(true)}
                  disabled={verifyMutation.isPending}
                >
                  Enter Code Manually
                </Button>

                {/* Instructions or Alert */}
                <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-left">
                    **For the Customer:** You can show this screen, or tell the
                    rider the code if the QR fails.
                  </p>
                </div>
              </div>
            ) : (
              /* Manual Code Entry */
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Manual Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter the code provided by the rider
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter code"
                    value={manualCode}
                    onChange={(e) =>
                      setManualCode(e.target.value.toUpperCase().slice(0, 6))
                    }
                    maxLength={6}
                    className="text-center text-2xl font-bold tracking-widest"
                    disabled={verifyMutation.isPending}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowManualEntry(false)}
                    disabled={verifyMutation.isPending}
                  >
                    Back to QR
                  </Button>
                  <Button
                    onClick={handleManualVerify}
                    disabled={
                      verifyMutation.isPending || manualCode.trim().length === 0
                    }
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Delivery"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
