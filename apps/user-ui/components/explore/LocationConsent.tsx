"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";

interface LocationConsentProps {
  onAccept: (coords: { lat: number; long: number }) => void;
  onDeny: () => void;
  open: boolean;
}

export default function LocationConsent({
  onAccept,
  onDeny,
  open,
}: LocationConsentProps) {
  const handleAccept = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onAccept({ lat: latitude, long: longitude });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          onDeny();
        },
        { timeout: 10000, enableHighAccuracy: true },
      );
    } else {
      onDeny();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDeny()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Enable Location</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            We need your location to show vendors near you and provide accurate
            delivery estimates. Your location is only used when you browse and
            is never shared with anyone else.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onDeny} className="flex-1">
            Select Address
          </Button>
          <Button onClick={handleAccept} className="flex-1 gap-2">
            <Navigation className="w-4 h-4" />
            Enable Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
