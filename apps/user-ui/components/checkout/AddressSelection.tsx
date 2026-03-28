"use client";

import * as React from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Label } from "@repo/ui/components/label";

import { api } from "@/actions/api";
// import CheckoutAddressDialog from "./CheckoutAddressDialog";

interface AddressSelectionProps {
  selectedAddress?: Address | null;
  onAddressSelect: (
    address: Address | null,
    contactInfo?: CheckoutContactInfo,
  ) => void;
  onNewAddress: (addressData: CheckoutAddressData) => void;
  setShowNewAddressDialog: (open: boolean) => void;
}

interface CheckoutContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  instructions?: string;
}

interface CheckoutAddressData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  state: string;
  country: string;
  coordinates?: Coordinates | null;
  instructions?: string;
}

export default function AddressSelection({
  selectedAddress,
  onAddressSelect,
  // onNewAddress,
  setShowNewAddressDialog,
}: AddressSelectionProps) {
  // const [showNewAddressDialog, setShowNewAddressDialog] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("");
  // const [selectedUserInfo, ]

  // Fetch user profile with addresses
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: api.fetchProfile,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  const addresses = profile?.address || [];

  // Handle address selection
  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = addresses.find(
      (addr: Address) => addr.address === addressId,
    );
    if (selected) {
      onAddressSelect(selected, {
        fullName: (profile as User)?.fullName,
        phoneNumber: (profile as User)?.phoneNumber,
        email: (profile as User)?.email,
      });
    }
  };

  // Handle new address submission
  // const handleNewAddressSubmit = (addressData: CheckoutAddressData) => {
  //   onNewAddress(addressData);
  //   setShowNewAddressDialog(false);
  // };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">
            Failed to load addresses: {(error as Error).message}
          </p>
          <Button onClick={() => setShowNewAddressDialog(true)}>
            Add New Address
          </Button>
        </CardContent>
      </Card>
    );
  }

  // User has no saved addresses
  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Saved Addresses
            </h3>
            <p className="text-gray-600 mb-6">
              Add your delivery address to continue with checkout
            </p>
            <Button
              onClick={() => setShowNewAddressDialog(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User has saved addresses - show selection
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Select Delivery Address
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNewAddressDialog(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          </div>

          <RadioGroup
            value={selectedAddressId}
            onValueChange={handleAddressChange}
            className="space-y-3"
          >
            {addresses.map((address: Address, index: number) => {
              const isSelected = selectedAddress?.address === address.address;

              return (
                <div key={`${address.address}-${index}`} className="relative">
                  <RadioGroupItem
                    value={address.address}
                    id={`address-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`address-${index}`}
                    className={`block cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current mt-0.5">
                          {isSelected && (
                            <Check className="w-3 h-3 text-current" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              Address {index + 1}
                            </p>
                            {address.coordinates && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Has GPS
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-700 mb-1">
                            {address.address}
                          </p>

                          <p className="text-sm text-gray-600">
                            {[address.state, address.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          {/*{address.coordinates && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {address.coordinates.lat.toFixed(4)},{" "}
                                {address.coordinates.long.toFixed(4)}
                              </span>
                            </div>
                          )}*/}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {addresses.length > 0 && !selectedAddressId && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Please select an address to continue
            </p>
          )}
        </CardContent>
      </Card>

      {/* New Address Dialog */}
      {/*<CheckoutAddressDialog
        open={showNewAddressDialog}
        onOpenChange={setShowNewAddressDialog}
        onSubmit={handleNewAddressSubmit}
      />*/}
    </>
  );
}
