// src/components/explore/ProductSearchResults.tsx
"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { ChevronRight, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { GroupedSearchResult } from "@/actions/api";

interface ProductSearchResultsProps {
  results: GroupedSearchResult[];
  searchQuery: string;
  message?: string;
}

export default function ProductSearchResults({
  results,
  searchQuery,
  message,
}: ProductSearchResultsProps) {
  const isStateMessage = message && message.includes("not yet available");

  if (results.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            {isStateMessage ? (
              <span className="text-3xl">🚚</span>
            ) : (
              <span className="text-3xl">🔍</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isStateMessage
              ? "Coming Soon to Your Area"
              : `No results for "${searchQuery}"`}
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            {isStateMessage ? (
              <span className="text-amber-600 font-medium">{message}</span>
            ) : (
              "Try adjusting your search or browse our vendors"
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <Card key={result.vendor.id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Vendor Header */}
            <Link
              href={`/vendor/${result.vendor.id}`}
              className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {result.vendor.logoUrl ? (
                  <Image
                    src={result.vendor.logoUrl}
                    alt={result.vendor.businessName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {result.vendor.businessName}
                  </h3>
                  <Badge
                    variant={result.vendor.isOpen ? "default" : "secondary"}
                    className={
                      result.vendor.isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {result.vendor.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  {result.vendor.rating! > 0 && (
                    <span className="flex items-center gap-1">
                      ⭐ {result.vendor.rating?.toFixed(1)}
                    </span>
                  )}
                  {result.vendor.deliveryTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.vendor.deliveryTime}
                    </span>
                  )}
                  {result.vendor.deliveryFee !== undefined && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />₦
                      {result.vendor.deliveryFee}
                    </span>
                  )}
                  {result.vendor.distance && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {result.vendor.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </Link>

            {/* Products from this vendor */}
            <div className="p-4 space-y-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase">
                {result.matchCount} product{result.matchCount !== 1 ? "s" : ""}{" "}
                found
              </p>
              <div className="space-y-2">
                {result.products.slice(0, 3).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-primary transition-colors"
                  >
                    {product.imageUrl && (
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-primary text-sm whitespace-nowrap">
                      ₦{product.basePrice.toLocaleString()}
                    </p>
                  </Link>
                ))}

                {result.products.length > 3 && (
                  <Link
                    href={`/vendor/${result.vendor.id}`}
                    className="block text-center text-sm text-primary hover:underline py-2"
                  >
                    View {result.products.length - 3} more product
                    {result.products.length - 3 !== 1 ? "s" : ""}
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
