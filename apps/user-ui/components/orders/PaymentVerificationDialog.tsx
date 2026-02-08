"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type VerificationStatus = "verifying" | "success" | "failed" | "error";

interface PaymentVerificationDialogProps {
  open: boolean;
  status: VerificationStatus;
  message?: string;
  orderId?: string;
  onRetry?: () => void;
  onCloseAction?: () => void;
}

export function PaymentVerificationDialog({
  open,
  status,
  message,
  orderId,
  onRetry,
  onCloseAction,
}: PaymentVerificationDialogProps) {
  const router = useRouter();

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/order/${orderId}`);
    }
    onCloseAction?.();
  };

  const handleGoHome = () => {
    router.push("/home");
    onCloseAction?.();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Icon based on status */}
            {status === "verifying" && (
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full" />
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            )}

            {status === "error" && (
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-yellow-600" />
              </div>
            )}

            {/* Title */}
            <AlertDialogTitle className="text-2xl text-center">
              {status === "verifying" && "Verifying Payment"}
              {status === "success" && "Payment Successful!"}
              {status === "failed" && "Payment Failed"}
              {status === "error" && "Verification Error"}
            </AlertDialogTitle>

            {/* Description */}
            <AlertDialogDescription className="text-center text-base">
              {status === "verifying" &&
                "Please wait while we confirm your payment..."}

              {status === "success" &&
                (message ||
                  "Your payment has been confirmed. Your order is being processed!")}

              {status === "failed" &&
                (message ||
                  "Your payment was not successful. Please try again or contact support.")}

              {status === "error" &&
                (message ||
                  "We encountered an error while verifying your payment. Please check your order status.")}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Actions */}
        {status !== "verifying" && (
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {status === "success" && (
              <>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full sm:w-auto"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleViewOrder}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  View Order
                </Button>
              </>
            )}

            {(status === "failed" || status === "error") && (
              <>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full sm:w-auto"
                >
                  Go Home
                </Button>
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    Retry Payment
                  </Button>
                )}
                {orderId && (
                  <Button
                    onClick={handleViewOrder}
                    className="w-full sm:w-auto"
                  >
                    View Order
                  </Button>
                )}
              </>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Alternative: Success Dialog (simpler version for COD orders)
export function OrderSuccessDialog({
  open,
  onCloseAction,
  orderId,
}: {
  open: boolean;
  onCloseAction: () => void;
  orderId?: string;
}) {
  const router = useRouter();

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/order/${orderId}`);
    }
    onCloseAction();
  };

  return (
    <AlertDialog open={open} onOpenChange={onCloseAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <AlertDialogTitle className="text-2xl text-center">
              Order Placed Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your order has been received and is being processed.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => router.push("/explore")}>
            Continue Exploring
          </Button>
          <Button
            onClick={handleViewOrder}
            className="bg-green-600 hover:bg-green-700"
          >
            View Order
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
