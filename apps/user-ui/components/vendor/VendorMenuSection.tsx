"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { ShoppingCart, Plus, Minus, Search } from "lucide-react";
import Image from "next/image";

import { cartAtom } from "@/store/cartAtom";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import { imageBurger as productFallbackImage } from "@repo/ui/assets";

interface VendorMenuSectionProps {
  groupedProducts: Record<string, Product[]>;
  vendorId: string;
}

export default function VendorMenuSection({
  groupedProducts,
}: VendorMenuSectionProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null,
  );

  const categories = Object.keys(groupedProducts);

  // Filter products based on search
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return groupedProducts;

    const filtered: Record<string, Product[]> = {};
    Object.entries(groupedProducts).forEach(([category, products]) => {
      const matchingProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      if (matchingProducts.length > 0) {
        filtered[category] = matchingProducts;
      }
    });
    return filtered;
  }, [groupedProducts, searchQuery]);

  const getItemQuantity = (productId: string) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  const addToCart = React.useCallback(
    (product: Product) => {
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
            vendor_name: product.vendor.businessName,
          },
        ]);
      }
    },
    [cart, setCart],
  );

  const updateQuantity = React.useCallback(
    (productId: string, delta: number) => {
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

  React.useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]!);
    }
  }, [categories, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-10 bg-gray-50 -mx-4 px-4 py-3 border-b">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveCategory(category);
                  const element = document.getElementById(
                    `category-${category}`,
                  );
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items by Category */}
      {Object.entries(filteredProducts).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              No items found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(filteredProducts).map(([category, products]) => (
          <div key={category} id={`category-${category}`} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 sticky top-16 bg-gray-50 py-2 z-10">
              {category}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => {
                const quantity = getItemQuantity(product.id);

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.imageUrl || productFallbackImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 96px, 112px"
                            className="object-cover"
                            loading="lazy"
                          />
                          {!product.isAvailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="secondary" className="text-xs">
                                Unavailable
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.basePrice.toFixed(2)}
                            </span>

                            {quantity > 0 ? (
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-white"
                                  onClick={() => updateQuantity(product.id, -1)}
                                  disabled={!product.isAvailable}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-semibold min-w-[24px] text-center">
                                  {quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-white"
                                  onClick={() => updateQuantity(product.id, 1)}
                                  disabled={!product.isAvailable}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                disabled={!product.isAvailable}
                                className="gap-1.5"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline">Add</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
