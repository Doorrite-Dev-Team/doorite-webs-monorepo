"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { urgentOrderAtom } from "@/store/notificationAtom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * UrgentOrderDialog - Handles urgent order notifications
 *
 * Displays a prominent alert dialog when urgent orders arrive
 * Plays audio notification (if provided)
 * Provides quick action to view the order
 */
export default function UrgentOrderDialog() {
  const router = useRouter();
  const [urgentOrder, setUrgentOrder] = useAtom(urgentOrderAtom);

  // Play audio when urgent order arrives
  useEffect(() => {
    if (urgentOrder?.audio) {
      urgentOrder.audio.play().catch((err) => {
        console.error("Failed to play notification sound:", err);
      });
    }
  }, [urgentOrder]);

  const handleViewOrder = () => {
    if (urgentOrder?.orderId) {
      router.push(`/orders/${urgentOrder.orderId}`);
    }
    handleClose();
  };

  const handleClose = () => {
    // Stop audio if playing
    if (urgentOrder?.audio) {
      urgentOrder.audio.pause();
      urgentOrder.audio.currentTime = 0;
    }
    setUrgentOrder(null);
  };

  return (
    <AlertDialog
      open={!!urgentOrder}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 p-4 animate-pulse">
              <Bell className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            New Urgent Order! 🚨
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            You have received a new order that requires immediate attention.
            {urgentOrder?.orderId && (
              <span className="block mt-2 font-semibold text-gray-900">
                Order #{urgentOrder.orderId}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={handleClose}
            className="bg-gray-200 text-gray-900 hover:bg-gray-300 order-2 sm:order-1"
          >
            Dismiss
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleViewOrder}
            className="bg-green-600 hover:bg-green-700 order-1 sm:order-2"
          >
            View Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
