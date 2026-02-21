"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Store,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { vendorImage } from "@/libs/utils";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const vendorLogo = vendorImage(vendor.logoUrl);

  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] overflow-hidden rounded-xl">
        <CardContent className="p-0">
          {/* Mobile Layout (< 640px) - Vertical */}
          <div className="sm:hidden">
            {/* Image Section */}
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
              {!imageError && vendorLogo ? (
                <Image
                  src={vendorLogo}
                  alt={vendor.businessName}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Store className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Status Badge Overlay */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant={vendor.isOpen ? "default" : "secondary"}
                  className={`text-xs font-medium shadow-md ${
                    vendor.isOpen
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {vendor.isOpen ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {vendor.isOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>

              {/* Rating Badge */}
              {vendor.rating && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {vendor.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
              {/* Title & Category */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mb-1">
                  {vendor.businessName}
                </h3>
                <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  {vendor.category}
                </p>
              </div>

              {/* Description */}
              {vendor.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {vendor.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                {vendor.distance !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {vendor.distance.toFixed(1)} km
                    </span>
                  </div>
                )}

                {vendor.avrgPreparationTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {vendor.avrgPreparationTime}
                    </span>
                  </div>
                )}

                {/*{vendor.priceRange && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1">
                    <span className="font-medium">
                      ₦{vendor.priceRange ?? 2000}
                    </span>
                  </div>
                )}*/}
              </div>

              {/* Tags */}
              {/*{vendor.tags && vendor.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {vendor.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}*/}
            </div>
          </div>

          {/* Desktop/Tablet Layout (>= 640px) - Horizontal */}
          <div className="hidden sm:block p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                {!imageError && vendorLogo ? (
                  <Image
                    src={vendorLogo}
                    alt={vendor.businessName}
                    fill
                    sizes="(max-width: 1024px) 112px, 128px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate group-hover:text-primary transition-colors mb-1">
                        {vendor.businessName}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{vendor.category}</span>
                        {vendor.avrgPreparationTime && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{vendor.avrgPreparationTime}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex flex-col items-end gap-1">
                      {vendor.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 py-0.5">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {/*{vendor.priceRange && (
                        <span className="text-xs font-medium text-gray-600 flex items-center gap-0.5">
                          ₦{vendor.priceRange ?? 2000}
                        </span>
                      )}*/}
                    </div>
                  </div>

                  {/* Description */}
                  {vendor.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {vendor.description}
                    </p>
                  )}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={vendor.isOpen ? "default" : "secondary"}
                      className={`text-xs font-medium ${
                        vendor.isOpen
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {vendor.isOpen ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {vendor.isOpen ? "Open" : "Closed"}
                    </Badge>

                    {vendor.distance !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {vendor.distance.toFixed(1)} km
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {/*{vendor.tags &&
                      vendor.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>*/}

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
