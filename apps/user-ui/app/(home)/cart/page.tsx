"use client";

import { useAtom } from "jotai";
import {
  AlertCircle,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { cartAtom, EmptyCartAtom, totalPriceAtom } from "@/store/cartAtom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useAtom(cartAtom);
  const [totalPrice] = useAtom(totalPriceAtom);
  const [, emptyCart] = useAtom(EmptyCartAtom);
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [removingItemId, setRemovingItemId] = React.useState<string | null>(
    null,
  );

  // Group items by vendor
  const groupedByVendor = React.useMemo(() => {
    const groups: Record<string, CartItem[]> = {};
    cart.forEach((item) => {
      if (!groups[item.vendor_name]) {
        groups[item.vendor_name] = [];
      }
      groups[item.vendor_name]?.push(item);
    });
    return groups;
  }, [cart]);

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

  const removeItem = React.useCallback(
    (id: string) => {
      setRemovingItemId(id);
      setTimeout(() => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        setRemovingItemId(null);
      }, 300);
    },
    [setCart],
  );

  const handleClearCart = React.useCallback(() => {
    emptyCart();
    setShowClearDialog(false);
  }, [emptyCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const serviceFee = cart.length > 0 ? 1.99 : 0;
  const subtotal = totalPrice;
  const total = subtotal + deliveryFee + serviceFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Continue Exploring</span>
            </Link>
          </div>

          {/* Empty State */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some delicious items to get started!
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/vendor")}
                className="gap-2"
              >
                <Store className="w-5 h-5" />
                Browse Vendors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Link>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Your Cart
            </h1>
            <Badge variant="secondary" className="text-sm">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Cart</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedByVendor).map(([vendorName, items]) => (
              <Card
                key={vendorName}
                className="border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Vendor Header */}
                  <div className="bg-gray-50 border-b px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">
                        {vendorName}
                      </h3>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 sm:p-6 transition-all ${
                          removingItemId === item.id
                            ? "opacity-0 scale-95"
                            : "opacity-100 scale-100"
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                              {item.name}
                            </h4>
                            {/*{item.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {item.description}
                              </p>
                            )}*/}

                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              {/* Price */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                  ₦{item.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  each
                                </span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-white"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="text-sm font-semibold min-w-[32px] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-white"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Subtotal:
                                </span>
                                <span className="text-lg font-bold text-primary">
                                  ₦{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code - Mobile */}
            <Card className="lg:hidden border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Promo Code</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-medium">
                        ${deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Service Fee</span>
                      <span className="font-medium">
                        ${serviceFee.toFixed(2)}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p>
                      Your order will be confirmed after payment. Estimated
                      delivery time will be shown at checkout.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Code - Desktop */}
              <Card className="hidden lg:block border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Promo Code</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={() => router.push("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Clear Cart Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
