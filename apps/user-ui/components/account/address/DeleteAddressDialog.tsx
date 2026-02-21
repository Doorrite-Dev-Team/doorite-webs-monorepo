// components/account/address/DeleteAddressDialog.tsx
"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";

interface DeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: Address | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteAddressDialog({
  open,
  onOpenChange,
  address,
  onConfirm,
  isLoading,
}: DeleteAddressDialogProps) {
  if (!address) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Address?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This address will be permanently
            removed from your account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {address.address}
            </p>
            <p className="text-sm text-gray-600">
              {[address.state, address.country].filter(Boolean).join(", ")}
            </p>
          </div>

          <div className="flex items-start gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Any orders using this address will not be affected. Only future
              orders will be unable to use this address.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove Address"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
