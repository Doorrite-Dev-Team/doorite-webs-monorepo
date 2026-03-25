// src/components/explore/SavedAddressPicker.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { MapPin } from "lucide-react";

interface Address {
  address: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
}

interface SavedAddressPickerProps {
  open: boolean;
  addresses: Address[];
  onSelect: (coords: { lat: number; long: number }) => void;
  onSkip: () => void;
}

export default function SavedAddressPicker({
  open,
  addresses,
  onSelect,
  onSkip,
}: SavedAddressPickerProps) {
  const addressesWithCoords = addresses.filter(
    (addr) => addr.coordinates?.lat && addr.coordinates?.long,
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onSkip()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </div>
          <DialogDescription>
            Choose a saved address to find vendors near you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {addressesWithCoords.map((addr, idx) => (
            <button
              key={idx}
              onClick={() =>
                onSelect({
                  lat: addr.coordinates!.lat,
                  long: addr.coordinates!.long,
                })
              }
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 hover:border-primary transition-colors min-h-[44px]"
            >
              <p className="font-medium text-gray-900">{addr.address}</p>
              <p className="text-sm text-gray-500">
                {addr.state && `${addr.state}, `}
                {addr.country}
              </p>
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={onSkip} className="w-full mt-4">
          Continue Without Location
        </Button>
      </DialogContent>
    </Dialog>
  );
}
