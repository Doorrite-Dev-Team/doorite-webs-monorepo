"use client";

import * as React from "react";
import {
  MapPin,
  Loader2,
  AlertTriangle,
  Phone,
  MessageSquare,
} from "lucide-react";

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

import GeoLocationRequester from "../account/address/GeoLocationRequester";

interface CheckoutAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CheckoutAddressData) => void;
  isLoading?: boolean;
}

interface CheckoutAddressData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  country: string;
  coordinates?: Coordinates | null;
  instructions?: string;
}

export default function CheckoutAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CheckoutAddressDialogProps) {
  const [formData, setFormData] = React.useState<CheckoutAddressData>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    country: "Nigeria",
    coordinates: null,
    instructions: "",
  });
  const [errors, setErrors] = React.useState<Partial<CheckoutAddressData>>({});
  const [showGeoRequester, setShowGeoRequester] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        state: "",
        country: "Nigeria",
        coordinates: null,
        instructions: "",
      });
      setErrors({});
      setShowGeoRequester(false);
    }
  }, [open]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutAddressData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a more detailed address";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Warning for missing coordinates (not a blocking error)
    if (!formData.coordinates) {
      toast.warning(
        "⚠️ Geolocation is highly recommended for accurate delivery in Nigeria",
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload: CheckoutAddressData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      instructions: formData.instructions?.trim() || "",
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
    toast.success(
      "✅ Location captured! Please review and confirm the address details.",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Address</DialogTitle>
          <DialogDescription>
            Enter your delivery details for this order
          </DialogDescription>
        </DialogHeader>

        {/* Nigeria-specific notification */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-900">
                Important for Nigeria Delivery
              </p>
              <ul className="text-xs text-amber-800 mt-1 space-y-1">
                <li>
                  • <strong>Geolocation</strong> is essential - riders rely on
                  GPS coordinates
                </li>
                <li>
                  • <strong>Street Address</strong> helps when GPS is not
                  accurate
                </li>
                <li>
                  • <strong>Phone Number</strong> for rider to contact you
                </li>
                <li>
                  • <strong>Instructions</strong> help riders find you faster
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4 py-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={errors.fullName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={errors.phone ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="address">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street, Near Landmark, Area"
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
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Delivery Instructions
            </Label>
            <Input
              id="instructions"
              placeholder="e.g., Call when you arrive, landmark directions, etc."
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* Coordinates Info */}
          {formData.coordinates && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">
                    ✓ Location coordinates captured
                  </p>
                  <p className="text-xs text-green-700 mt-1">
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
                variant={formData.coordinates ? "default" : "outline"}
                onClick={() => setShowGeoRequester(true)}
                size="sm"
                className="w-full gap-2"
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4" />
                {formData.coordinates
                  ? "Update Location"
                  : "📍 Use My Current Location (Recommended)"}
              </Button>
            ) : (
              <GeoLocationRequester
                onAccept={handleLocationAccepted}
                onCancel={() => setShowGeoRequester(false)}
              />
            )}
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
                Saving...
              </>
            ) : (
              "Continue Checkout"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
