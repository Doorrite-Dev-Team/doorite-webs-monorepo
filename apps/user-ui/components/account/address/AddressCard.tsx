// components/account/address/AddressCard.tsx
"use client";

import { Globe, Trash2, MapPin } from "lucide-react";
import { Button } from "@repo/ui/components/button";

interface AddressCardProps {
  address: Address;
  index: number;
  onDelete: () => void;
}

export default function AddressCard({
  address,
  index,
  onDelete,
}: AddressCardProps) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Globe className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900">Address {index + 1}</p>
          </div>

          <p className="text-sm text-gray-700 mb-1">{address.address}</p>

          <p className="text-sm text-gray-600">
            {[address.state, address.country].filter(Boolean).join(", ")}
          </p>

          {address.coordinates && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>
                {address.coordinates.lat.toFixed(4)},{" "}
                {address.coordinates.long.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
