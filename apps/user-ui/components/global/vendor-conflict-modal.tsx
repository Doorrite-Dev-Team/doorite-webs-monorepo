"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useAtomValue } from "jotai";
import { hasConflict } from "@/store/cartAtom";

export function VendorConflictModal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const h = useAtomValue(hasConflict);
  if (!h) return;
  const {
    isOpen,
    currentVendor,
    newVendor,
    onContinueWithCart,
    onSwitchVendor,
    onCancel,
  } = h;

  const handleContinueWithCart = async () => {
    setIsSubmitting(true);
    try {
      onContinueWithCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchVendor = async () => {
    setIsSubmitting(true);
    try {
      onSwitchVendor();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Different Vendor Detected
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your cart currently contains items from{" "}
            <span className="font-semibold">{currentVendor}</span>. You&apos;re
            trying to add items from{" "}
            <span className="font-semibold">{newVendor}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600">
            You can only order from one vendor at a time. Please choose:
          </p>
        </div>

        <AlertDialogFooter className="flex-col-reverse sm:flex-col gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleContinueWithCart}
              disabled={isSubmitting}
              variant="secondary"
              className="flex-1"
            >
              Continue with {currentVendor}
            </Button>

            <Button
              onClick={handleSwitchVendor}
              disabled={isSubmitting}
              className="flex-1"
            >
              Switch to {newVendor}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
