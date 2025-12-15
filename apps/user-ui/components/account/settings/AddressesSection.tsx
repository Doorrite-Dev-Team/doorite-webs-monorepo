"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { api } from "@/libs/api";

import AddAddressDialog from "../address/Dialogue";
import DeleteAddressDialog from "../address/DeleteAddressDialog";
import AddressCard from "../address/AddressCard";

interface AddressesSectionProps {
  addresses: Address[];
}

export default function AddressesSection({ addresses }: AddressesSectionProps) {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [deleteAddress, setDeleteAddress] = React.useState<Address | null>(
    null,
  );

  // Add address mutation
  const addMutation = useMutation({
    mutationFn: api.addAddress,
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], (oldData: any) => ({
        ...oldData,
        address: data.user.address,
      }));
      setShowAddDialog(false);
      toast.success("Address added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add address");
    },
  });

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: api.deleteAddress,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["user-profile"], (oldData: any) => ({
        ...oldData,
        address: oldData.address.filter(
          (addr: Address) => addr.address !== variables,
        ),
      }));
      setDeleteAddress(null);
      toast.success("Address removed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete address");
    },
  });

  const handleAddAddress = (addressData: DeliveryAddressForm) => {
    addMutation.mutate(addressData);
  };

  const handleDeleteAddress = () => {
    if (deleteAddress) {
      deleteMutation.mutate(deleteAddress.address);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddDialog(true)}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-4">No addresses saved yet</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              size="sm"
            >
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address, index) => (
              <AddressCard
                key={`${address.address}-${index}`}
                address={address}
                index={index}
                onDelete={() => setDeleteAddress(address)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Address Dialog */}
      <AddAddressDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddAddress}
        isLoading={addMutation.isPending}
      />

      {/* Delete Address Dialog */}
      <DeleteAddressDialog
        open={!!deleteAddress}
        onOpenChange={() => setDeleteAddress(null)}
        address={deleteAddress}
        onConfirm={handleDeleteAddress}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
