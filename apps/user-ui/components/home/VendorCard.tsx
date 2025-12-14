"use client";

import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import Image from "next/image";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
        <CardContent className="p-0">
          {/* Image/Logo */}
          <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
            {vendor.logoUrl ? (
              <Image
                src={vendor.logoUrl}
                alt={vendor.businessName}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🍽️
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                variant={vendor.isOpen ? "default" : "secondary"}
                className={`text-xs ${
                  vendor.isOpen
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {vendor.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {vendor.businessName}
            </h3>
            <p className="text-sm text-gray-600 capitalize mb-2 line-clamp-1">
              {vendor.category}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {vendor.rating?.toFixed(1) || "New"}
                </span>
              </div>

              {vendor.avrgPreparationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{vendor.avrgPreparationTime}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
