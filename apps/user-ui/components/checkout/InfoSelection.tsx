"use client";

import * as React from "react";
import { MapPin, Plus, Check } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Label } from "@repo/ui/components/label";
import { useRouter } from "next/navigation";

interface InfoSelectionProps {
  user?: User | null;
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onNewAddress: () => void;
  isLoading: boolean;
  error: Error | null;
  setShowNewAddressDialog: (open: boolean) => void;
}

export default function InfoSelection({
  user,
  selectedAddress,
  onAddressSelect,
  onNewAddress,
  isLoading,
  error,
  setShowNewAddressDialog,
}: InfoSelectionProps) {
  const router = useRouter();

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

  if (!user || error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">
            Failed to load addresses: {(error as Error).message}
          </p>
          <Button onClick={() => setShowNewAddressDialog(true)}>
            Add New Address
          </Button>
          <Button variant="secondary" onClick={() => router.refresh()}>
            refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  const addresses = user.address || [];

  // No saved addresses
  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No Delivery Address
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Add your delivery address to continue
            </p>
            <Button onClick={onNewAddress} className="gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Add Delivery Address
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show address selection
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Delivery Address
            </h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onNewAddress}
            className="gap-1 text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add New</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <RadioGroup
          value={selectedAddress?.address || ""}
          onValueChange={(value) => {
            const address = addresses.find((addr) => addr.address === value);
            if (address) onAddressSelect(address);
          }}
          className="space-y-3"
        >
          {addresses.map((address, index) => {
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
                  className={`block cursor-pointer rounded-lg border-2 p-3 sm:p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current mt-0.5 flex-shrink-0">
                      {isSelected && <Check className="w-3 h-3 text-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          Address {index + 1}
                        </p>
                        {address.coordinates && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            GPS
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 mb-1">
                        {address.address}
                      </p>

                      {(address.state || address.country) && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          {[address.state, address.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {!selectedAddress && (
          <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
            Select a delivery address to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
}
