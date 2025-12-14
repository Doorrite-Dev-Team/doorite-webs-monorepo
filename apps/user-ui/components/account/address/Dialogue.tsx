"use client";

import * as React from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { toast } from "@repo/ui/components/sonner";

import GeoLocationRequester from "./GeoLocationRequester";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

interface AddressFormData {
  address: string;
  state: string;
  country: string;
  coordinates?: { lat: number; long: number } | null;
}

export default function AddAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddAddressDialogProps) {
  const [formData, setFormData] = React.useState<AddressFormData>({
    address: "",
    state: "",
    country: "Nigeria",
    coordinates: null,
  });
  const [errors, setErrors] = React.useState<Partial<AddressFormData>>({});
  const [showGeoRequester, setShowGeoRequester] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        address: "",
        state: "",
        country: "Nigeria",
        coordinates: null,
      });
      setErrors({});
      setShowGeoRequester(false);
    }
  }, [open]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a more detailed address";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: any = {
      address: formData.address.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
    };

    // Include coordinates if available
    if (formData.coordinates) {
      payload.coordinates = formData.coordinates;
    }

    onSubmit(payload);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setShowGeoRequester(false);
  };

  const handleLocationAccepted = (
    coords: { latitude: number; longitude: number },
    preview?: { display_name?: string; state?: string; country?: string },
  ) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat: coords.latitude, long: coords.longitude },
      // Auto-fill from reverse geocode if available and fields are empty
      address: prev.address || preview?.display_name || prev.address,
      state: prev.state || preview?.state || prev.state,
      country: prev.country || preview?.country || prev.country,
    }));
    setShowGeoRequester(false);
    toast.success("Location added! You can edit the details before saving.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Add a delivery address to your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Address Field */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Full Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="123 Main Street, Apt 4B, University Quarters"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={errors.address ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* State and Country */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                placeholder="Lagos"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className={errors.state ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                placeholder="Nigeria"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className={errors.country ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Coordinates Info */}
          {formData.coordinates && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">
                    Location coordinates saved
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Lat: {formData.coordinates.lat.toFixed(6)}, Long:{" "}
                    {formData.coordinates.long.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Geolocation UI */}
          <div className="pt-2 border-t">
            {!showGeoRequester ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGeoRequester(true)}
                size="sm"
                className="w-full gap-2"
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4" />
                {formData.coordinates
                  ? "Update Location"
                  : "Use My Current Location"}
              </Button>
            ) : (
              <GeoLocationRequester
                onAccept={handleLocationAccepted}
                onCancel={() => setShowGeoRequester(false)}
              />
            )}
          </div>

          {/* Help Text */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-gray-700">
              <p className="font-medium mb-1">Tip:</p>
              <ul className="text-xs space-y-1">
                <li>• Include landmarks for easier delivery</li>
                <li>• Adding your location helps riders find you faster</li>
                <li>• You can edit any auto-filled information</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Address"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
