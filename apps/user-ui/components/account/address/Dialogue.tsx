"use client";

import * as React from "react";
import {
  MapPin,
  Loader2,
  AlertCircle,
  Navigation,
  Shield,
  Info,
} from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import { toast } from "@repo/ui/components/sonner";

import GeoLocationRequester from "./GeoLocationRequester";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeliveryAddressForm) => void;
  isLoading: boolean;
  mode?: "dialog" | "sheet";
}

interface AddressFormData {
  address: string;
  state: string;
  country: string;
  coordinates?: Coordinates | null;
}

// Hardcoded options - only Kwara and Nigeria available
const STATE_OPTIONS = [{ value: "Kwara", label: "Kwara" }];

const COUNTRY_OPTIONS = [{ value: "Nigeria", label: "Nigeria" }];

export default function AddAddressDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  mode = "dialog",
}: AddAddressDialogProps) {
  const [formData, setFormData] = React.useState<AddressFormData>({
    address: "",
    state: "Kwara",
    country: "Nigeria",
    coordinates: null,
  });
  const [errors, setErrors] = React.useState<Partial<AddressFormData>>({});
  const [showGeoRequester, setShowGeoRequester] = React.useState(false);
  const [showExplanationDialog, setShowExplanationDialog] =
    React.useState(false);
  const [hasDeclinedOnce, setHasDeclinedOnce] = React.useState(false);

  // Memoized coordinates to ensure they persist
  const coordinatesMemo = React.useMemo(() => {
    return formData.coordinates;
  }, [formData.coordinates]);

  React.useEffect(() => {
    if (open) {
      setFormData({
        address: "",
        state: "Kwara",
        country: "Nigeria",
        coordinates: null,
      });
      setErrors({});
      setShowGeoRequester(false);
      setShowExplanationDialog(false);
      setHasDeclinedOnce(false);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a more detailed address";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    if (!formData.coordinates) {
      newErrors.coordinates = null;
      toast.error(
        "Location coordinates are required. Please use 'Use My Current Location' button.",
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!formData.coordinates;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      address: formData.address.trim(),
      state: formData.state,
      country: formData.country,
    };

    if (formData.coordinates) {
      payload.coordinates = formData.coordinates;
    }

    onSubmit(payload);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setShowGeoRequester(false);
    setShowExplanationDialog(false);
  };

  const handleLocationAccepted = (
    coords: { latitude: number; longitude: number },
    preview?: { display_name?: string; state?: string; country?: string },
  ) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat: coords.latitude, long: coords.longitude },
      address: prev.address || preview?.display_name || prev.address,
    }));
    setShowGeoRequester(false);
    setShowExplanationDialog(false);
    toast.success(
      "Location added! You can edit the address details before saving.",
    );
  };

  const handleLocationCancelled = () => {
    setShowGeoRequester(false);

    if (hasDeclinedOnce) {
      // Second decline - close the entire dialog
      onOpenChange(false);
      toast.info(
        "Address creation cancelled. Location access is required for delivery.",
      );
    } else {
      // First decline - show explanation
      setHasDeclinedOnce(true);
      setShowExplanationDialog(true);
    }
  };

  const handleTryAgain = () => {
    setShowExplanationDialog(false);
    setShowGeoRequester(true);
  };

  const handleExplanationCancel = () => {
    setShowExplanationDialog(false);
    onOpenChange(false);
    toast.info(
      "Address creation cancelled. Location access is required for delivery.",
    );
  };

  const formContent = (
    <div className="space-y-4 py-4">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="state">
            State <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.state}
            onValueChange={(value) =>
              setFormData({ ...formData, state: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger
              id="state"
              className={errors.state ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData({ ...formData, country: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger
              id="country"
              className={errors.country ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      {coordinatesMemo && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">
                Location coordinates saved
              </p>
              <p className="text-xs text-green-700 mt-1">
                Lat: {coordinatesMemo.lat.toFixed(6)}, Long:{" "}
                {coordinatesMemo.long.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!coordinatesMemo && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Location Required</p>
              <p className="text-xs text-amber-700 mt-1">
                Please use the button below to share your location for accurate
                delivery.
              </p>
            </div>
          </div>
        </div>
      )}

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
            {coordinatesMemo ? "Update Location" : "Use My Current Location"}
          </Button>
        ) : (
          <GeoLocationRequester
            onAccept={handleLocationAccepted}
            onCancel={handleLocationCancelled}
            showPreview={true}
          />
        )}
      </div>

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
  );

  // Explanation Dialog Component
  const explanationDialog = (
    <Dialog
      open={showExplanationDialog}
      onOpenChange={setShowExplanationDialog}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-blue-600" />
            <DialogTitle className="text-xl">
              Location Access Required
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <span className="font-bold text-blue-700">
                    Why we need your location:
                  </span>
                  <br />
                  <br />
                  Your{" "}
                  <span className="font-semibold underline">
                    precise location
                  </span>{" "}
                  ensures
                  <span className="font-bold text-blue-800">
                    {" "}
                    efficient delivery
                  </span>{" "}
                  and enables
                  <span className="font-bold text-blue-800">
                    {" "}
                    accurate map navigation
                  </span>{" "}
                  for our delivery riders. This helps us get your orders to you{" "}
                  <span className="font-semibold">faster</span> and with
                  <span className="font-semibold">greater precision</span>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">
                    Your Privacy is Protected
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your location data is{" "}
                    <span className="font-bold">encrypted</span> and
                    <span className="font-bold"> securely stored</span>. We
                    never share your information with third parties. It is used
                    solely for delivery purposes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Without location access, we cannot guarantee accurate delivery
                  to your address.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleExplanationCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleTryAgain} className="flex-1 gap-2">
            <Navigation className="w-4 h-4" />
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (mode === "sheet") {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add New Address</SheetTitle>
              <SheetDescription>
                Add a delivery address to your account
              </SheetDescription>
            </SheetHeader>
            {formContent}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Address"
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        {explanationDialog}
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Add a delivery address to your account
            </DialogDescription>
          </DialogHeader>

          {formContent}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
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
      {explanationDialog}
    </>
  );
}
