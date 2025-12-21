"use client";

import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { useAtom } from "jotai";
import * as React from "react";
import {
  ShoppingCart,
  Store,
  ImageOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { imageBurger as productFallbackImage } from "@repo/ui/assets";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { cartAtom } from "@/store/cartAtom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [imageError, setImageError] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const itemQuantity = cartItem?.quantity || 0;

  const updateQuantity = React.useCallback(
    (id: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [setCart],
  );

  const handleAddToCart = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsAdding(true);

      if (itemQuantity > 0) {
        updateQuantity(product.id, 1);
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            // description: product.description,
            price: product.basePrice,
            vendor_name: product.vendor.businessName,
            quantity: 1,
          },
        ]);
      }

      setTimeout(() => setIsAdding(false), 300);
    },
    [product, itemQuantity, updateQuantity, setCart],
  );

  const handleQuantityChange = React.useCallback(
    (e: React.MouseEvent, delta: number) => {
      e.preventDefault();
      e.stopPropagation();
      updateQuantity(product.id, delta);
    },
    [product.id, updateQuantity],
  );

  return (
    <Link
      href={`/product/${product.id}` as Route<string>}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
    >
      <Card className="h-full rounded-lg border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Container */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {!imageError && (product.imageUrl || productFallbackImage) ? (
              <Image
                src={product.imageUrl ?? productFallbackImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority={false}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageOff className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Availability Badge Overlay */}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-900"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Vendor Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                variant={product.vendor.isActive ? "default" : "secondary"}
                className={`text-xs font-medium shadow-sm ${
                  product.vendor.isActive
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-500 text-white"
                }`}
              >
                {product.vendor.isActive ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {product.vendor.isActive ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-1 p-3 sm:p-4 space-y-3">
            {/* Title & Description */}
            <div className="flex-1 space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Vendor Details */}
            <div className="flex items-center gap-2 py-2 border-t border-gray-100">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-gray-100">
                <AvatarImage
                  src={product.vendor.logoUrl}
                  alt={product.vendor.businessName}
                />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {product.vendor.businessName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                  <Store className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  {product.vendor.businessName}
                </p>
                {product.vendor.address && (
                  <p className="text-xs text-gray-500 truncate">
                    {product.vendor.address?.address}
                  </p>
                )}
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  ₦{product.basePrice.toFixed(2)}
                </span>
              </div>

              {itemQuantity > 0 ? (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-white"
                    onClick={(e) => handleQuantityChange(e, -1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <span className="text-sm font-semibold min-w-[24px] text-center">
                    {itemQuantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-white"
                    onClick={(e) => handleQuantityChange(e, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={
                    !product.isAvailable || !product.vendor.isActive || isAdding
                  }
                  className="gap-1.5 transition-all disabled:opacity-50"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
