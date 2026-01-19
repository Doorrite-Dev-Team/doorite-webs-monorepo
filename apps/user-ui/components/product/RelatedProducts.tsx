"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cartAtom } from "@/store/cartAtom";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
// import { imageBurger as productFallbackImage } from "@repo/ui/assets";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [cart, setCart] = useAtom(cartAtom);

  const getItemQuantity = (productId: string) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  const addToCart = React.useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.preventDefault();
      e.stopPropagation();

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        setCart((prev) =>
          prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.basePrice,
            quantity: 1,
            vendorName: product.vendor.businessName,
            vendorId: product.vendorId,
          },
        ]);
      }
    },
    [cart, setCart],
  );

  const updateQuantity = React.useCallback(
    (e: React.MouseEvent, productId: string, delta: number) => {
      e.preventDefault();
      e.stopPropagation();

      setCart((prev) =>
        prev
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [setCart],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => {
        const quantity = getItemQuantity(product.id);

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          >
            <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.imageUrl || "/no-image.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Availability Badge */}
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
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₦{product.basePrice.toFixed(2)}
                    </span>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 hover:bg-white"
                          onClick={(e) => updateQuantity(e, product.id, -1)}
                          disabled={!product.isAvailable}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="text-sm font-semibold min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 hover:bg-white"
                          onClick={(e) => updateQuantity(e, product.id, 1)}
                          disabled={!product.isAvailable}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => addToCart(e, product)}
                        disabled={!product.isAvailable}
                        className="gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
