"use client";

import { useAtom } from "jotai";
import { urgentOrderAtom } from "@/store/notificationAtom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";

export function NewOrderAlert() {
  const [urgentOrder, setUrgentOrder] = useAtom(urgentOrderAtom);
  const router = useRouter();

  const handleStop = () => {
    // Stop the looping sound
    if (urgentOrder?.audio) {
      urgentOrder.audio.pause();
      urgentOrder.audio.currentTime = 0;
    }
    setUrgentOrder(null);
  };

  const handleViewOrder = () => {
    handleStop();
    if (urgentOrder?.orderId) {
      router.push(`/dashboard/orders/${urgentOrder.orderId}`);
    }
  };

  return (
    <AlertDialog
      open={!!urgentOrder}
      onOpenChange={(open) => !open && handleStop()}
    >
      <AlertDialogContent className="border-l-4 border-l-orange-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-orange-600 animate-pulse">
            🔔 New Order Received!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            A new order is waiting for acceptance. Quick response improves your
            vendor rating.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4 sm:space-x-0">
          <AlertDialogCancel>
            <Button
              variant="outline"
              onClick={handleStop}
              className="w-full sm:w-auto"
            >
              Dismiss (Stop Sound)
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={handleViewOrder}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
            >
              Accept / View Order
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
