"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { MapPin, Clock, Star } from "lucide-react";
import { vendor } from "@/libs/contant";

export default function VendorCard({ vendor }: { vendor: vendor }) {
  const isValidImage =
    typeof vendor.image === "string" &&
    (vendor.image.startsWith("http") || vendor.image.startsWith("/"));

  const imageSrc = isValidImage ? vendor.image : "/placeholder.png"; // 👈 fallback image

  return (
    <Link href={`/vendor/${vendor.id}`} className="block group">
      <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.01]">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {vendor.subcategory} • {vendor.avrgPreparationTime}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium">
                      {vendor.rating ?? "-"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{vendor.priceRange}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {vendor.description}
              </p>

              <div className="flex items-center gap-3 text-xs">
                <Badge
                  variant={vendor.isOpen ? "default" : "secondary"}
                  className={`text-xs ${
                    vendor.isOpen
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {vendor.isOpen ? "Open" : "Closed"}
                </Badge>

                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin size={12} />
                  <span>{vendor.distance ?? "-"} km</span>
                </div>

                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock size={12} />
                  <span>{vendor.avrgPreparationTime ?? "-"}</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={vendor.name}
                width={80}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
