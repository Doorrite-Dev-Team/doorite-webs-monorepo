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
            router.push(`/map`); // Redirect to map for riders? Or order details?
            // Assuming map is where they see requests or a specific order page.
        }
    };

    return (
        <AlertDialog
            open={!!urgentOrder}
            onOpenChange={(open) => !open && handleStop()}
        >
            <AlertDialogContent className="border-l-4 border-l-blue-500">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-blue-600 animate-pulse">
                        🚴 New Delivery Request!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-lg">
                        A new delivery is available nearby. Accept it quickly to earn more!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4 sm:space-x-0">
                    <AlertDialogCancel>
                        <Button
                            variant="outline"
                            onClick={handleStop}
                            className="w-full sm:w-auto"
                        >
                            Dismiss
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction>
                        <Button
                            onClick={handleViewOrder}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            View Delivery
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
