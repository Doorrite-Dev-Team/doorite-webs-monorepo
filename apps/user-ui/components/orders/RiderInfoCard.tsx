"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, Star } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { api } from "@/libs/api";

interface RiderInfoCardProps {
  orderId: string;
  riderId: string;
}

export default function RiderInfoCard({ riderId }: RiderInfoCardProps) {
  const { data: rider, isLoading } = useQuery({
    queryKey: ["rider", riderId],
    queryFn: () => api.fetchRider(riderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-4 border-t">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!rider) return null;

  const getVehicleIcon = () => {
    switch (rider.vehicleType) {
      case "MOTORCYCLE":
        return "🏍️";
      case "BIKE":
        return "🚲";
      case "CAR":
        return "🚗";
      case "BICYCLE":
        return "🚴";
      default:
        return "🛵";
    }
  };

  return (
    <div className="p-4 sm:p-6 border-t bg-white">
      <div className="flex items-center gap-4 mb-4">
        {/* Rider Avatar */}
        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
          <AvatarImage src={rider.profileImageUrl} alt={rider.fullName} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {rider.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Rider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {rider.fullName}
            </h3>
            <span className="text-2xl">{getVehicleIcon()}</span>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600 capitalize">
              {rider.vehicleType.toLowerCase().replace("_", " ")}
            </p>

            {rider.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900">
                  {rider.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${rider.phoneNumber}`} className="block">
          <Button variant="default" className="w-full gap-2" size="sm">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Rider</span>
            <span className="sm:hidden">Call</span>
          </Button>
        </a>

        <Button variant="outline" className="w-full gap-2" size="sm">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Message</span>
          <span className="sm:hidden">Chat</span>
        </Button>
      </div>
    </div>
  );
}
