"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

import { cartAtom } from "@/store/cartAtom";
import { Button } from "@repo/ui/components/button";
import { isVendorOpen } from "@/libs/utils";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const [showAdded, setShowAdded] = React.useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const addToCart = React.useCallback(() => {
    if (cartItem) {
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

    // Show success feedback
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  }, [product, cartItem, setCart]);

  const updateQuantity = React.useCallback(
    (delta: number) => {
      setCart((prev) =>
        prev
          .map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [product.id, setCart],
  );

  const isDisabled =
    !product.isAvailable ||
    !product.vendor.isActive ||
    isVendorOpen(product.vendor);

  if (quantity > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Quantity</span>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => updateQuantity(-1)}
              disabled={isDisabled}
              className="h-12 w-12 p-0 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <span className="text-2xl font-bold text-gray-900 min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              size="lg"
              variant="outline"
              onClick={() => updateQuantity(1)}
              disabled={isDisabled}
              className="h-12 w-12 p-0 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Subtotal</span>
          <span className="text-2xl font-bold text-primary">
            ₦{(product.basePrice * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      onClick={addToCart}
      disabled={isDisabled}
      className="w-full h-14 text-lg font-semibold gap-2 transition-all"
    >
      {showAdded ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          {isDisabled
            ? !product.isAvailable
              ? "Out of Stock"
              : "Vendor Closed"
            : "Add to Cart"}
        </>
      )}
    </Button>
  );
}
