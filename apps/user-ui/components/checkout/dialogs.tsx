"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { CheckCircle2 } from "lucide-react";

// 5. AddressDialog
interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: DeliveryAddressForm;
  setAddress: (address: DeliveryAddressForm) => void;
}
export const AddressDialog = ({
  open,
  onOpenChange,
  address,
  setAddress,
}: AddressDialogProps) => {
  const isFormValid =
    address.fullName && address.phone && address.email && address.address;

  const handleSave = () => {
    if (isFormValid) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delivery Address</DialogTitle>
          <DialogDescription>
            Enter your delivery details for this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={address.email}
              onChange={(e) =>
                setAddress({ ...address, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Campus Address"
              value={address.address}
              onChange={(e) =>
                setAddress({ ...address, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Input
                id="building"
                placeholder="Dormitory A"
                value={address.building}
                onChange={(e) =>
                  setAddress({ ...address, building: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="201"
                value={address.room}
                onChange={(e) =>
                  setAddress({ ...address, room: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Delivery Instructions (Optional)
            </Label>
            <Input
              id="instructions"
              placeholder="e.g., Call when you arrive"
              value={address.instructions}
              onChange={(e) =>
                setAddress({ ...address, instructions: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 6. SuccessDialog
interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <DialogTitle className="text-2xl mb-2">
          Order Placed Successfully!
        </DialogTitle>
        <DialogDescription className="text-base">
          Your order has been confirmed. You&apos;ll be redirected to track your
          order shortly.
        </DialogDescription>
      </div>
    </DialogContent>
  </Dialog>
);
