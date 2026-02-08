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

interface DeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeliveryData) => void;
  user?: User | null;
  isLoading?: boolean;
}

interface DeliveryData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  state: string;
  country: string;
  coordinates: Coordinates | null;
  instructions?: string;
}

export default function DeliveryDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading = false,
}: DeliveryDialogProps) {
  // if (!user)
  // const user = useAtomValue(userAtom)

  const [formData, setFormData] = React.useState<DeliveryData>({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    address: "",
    state: "",
    country: "Nigeria",
    coordinates: null,
    instructions: "",
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof DeliveryData, string>>
  >({});
  const [showGeoRequester, setShowGeoRequester] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        fullName: user?.fullName || "",
        phoneNumber: user?.phoneNumber || "",
        email: user?.email || "",
        address: "",
        state: "",
        country: "Nigeria",
        coordinates: null,
        instructions: "",
      });
      setErrors({});
      setShowGeoRequester(false);
    }
  }, [open, user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address too short";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.coordinates) {
      toast.warning("GPS location recommended for accurate delivery");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      coordinates: formData.coordinates,
      instructions: formData.instructions?.trim(),
    });
  };

  const handleLocationAccepted = (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat: coords.latitude, long: coords.longitude },
    }));
    setShowGeoRequester(false);
    toast.success("Location captured");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Delivery Address
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Enter your delivery details for this order
          </DialogDescription>
        </DialogHeader>

        {/* Nigeria delivery notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-medium text-amber-900">Important</p>
              <p className="text-amber-800 mt-1">
                GPS location is essential for delivery in Nigeria. Riders rely
                on coordinates.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs sm:text-sm">
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
                <p className="text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">
                Email <span className="text-red-500">*</span>
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
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs sm:text-sm">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="123 Main St, Near Landmark"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={errors.address ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-xs sm:text-sm">
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
                  <p className="text-xs text-red-600">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-xs sm:text-sm">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-xs sm:text-sm">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Delivery Instructions
            </Label>
            <Input
              id="instructions"
              placeholder="e.g., Call when you arrive"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          {/* GPS Info */}
          {formData.coordinates && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">
                    GPS Location Saved
                  </p>
                  <p className="text-green-700 mt-1">
                    {formData.coordinates.lat.toFixed(4)},{" "}
                    {formData.coordinates.long.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Geolocation */}
          <div className="pt-2 border-t">
            {!showGeoRequester ? (
              <Button
                type="button"
                variant={formData.coordinates ? "default" : "outline"}
                onClick={() => setShowGeoRequester(true)}
                size="sm"
                className="w-full gap-2 text-xs sm:text-sm"
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
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            size="sm"
            className="text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
