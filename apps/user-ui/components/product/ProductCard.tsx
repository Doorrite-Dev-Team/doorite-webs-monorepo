"use client";

// components/ProductCard.tsx
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Route } from "next";
import { isVendorOpen } from "@/libs/utils";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = product.basePrice;
  const { addItem } = useCart();

  return (
    <Link href={`/product/${product.id}` as Route<string>}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] touch-manipulation will-change-transform transform-gpu">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl || "/no-image.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {!isVendorOpen(product.vendor) && (
            <Badge className="absolute top-2 right-2 bg-red-500">Closed</Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1">
            {product.vendor?.businessName}
          </p>

          {/*<div className="flex items-center gap-1 text-xs text-gray-600">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {product.rating?.toFixed(1) || "New"}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-gray-400">({product.reviewCount})</span>
            )}
          </div>*/}

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-bold text-primary">
                ₦{(lowestPrice ?? 0).toLocaleString()}
              </p>
              {product.variants?.length > 0 && (
                <p className="text-xs text-gray-500">
                  + {product.variants.length} options
                </p>
              )}
            </div>

            <Button
              size="sm"
              className="gap-1"
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: lowestPrice ?? 0,
                  vendorId: product.vendorId,
                  vendorName: product.vendor?.businessName,
                  quantity: 1,
                })
              }
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
