"use client";

import {
  AlertCircle,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
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
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const router = useRouter();
  const [showClearDialog, setShowClearDialog] = React.useState(false);

  const {
    cart,
    clearCart,
    updateQuantity,
    removeItem,
    getTotals,
    getGroupedItems,
    itemCount,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Continue Exploring</span>
            </Link>
          </div>

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
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/home"
              className="shrink-0 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Link>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
              Your Cart
            </h1>
            <Badge variant="secondary" className="shrink-0">
              {itemCount}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            className="shrink-0 gap-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {Object.entries(getGroupedItems()).map(([vendorId, items]) => (
              <Card
                key={vendorId}
                className="border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="bg-gray-50 border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Store className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-semibold text-gray-900 truncate">
                        {vendorId}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 uppercase text-[10px]"
                    >
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </Badge>
                  </div>

                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 break-words">
                              {item.name}
                            </h4>

                            <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
                              <div className="flex items-baseline gap-1.5 shrink-0">
                                <span className="text-lg font-bold text-gray-900">
                                  ₦{item.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500 italic">
                                  each
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-gray-100 rounded-lg p-1 border">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </Button>
                                  <span className="text-sm font-bold w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </Button>
                                </div>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 h-9 w-9"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-dashed flex items-center justify-between">
                              <span className="text-xs text-gray-500 uppercase font-medium">
                                Line Total
                              </span>
                              <span className="text-lg font-bold text-primary">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 min-w-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        label: `Subtotal (${itemCount})`,
                        value: getTotals().subtotal,
                      },
                      { label: "Delivery Fee", value: getTotals().deliveryFee },
                      { label: "Service Fee", value: getTotals().serviceFee },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>{row.label}</span>
                        <span className="font-semibold text-gray-900">
                          ₦{row.value.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-black text-primary italic">
                        ₦{getTotals().total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-bold shadow-md"
                    onClick={() => router.push("/checkout")}
                  >
                    Checkout Now
                  </Button>

                  <div className="flex gap-3 text-xs text-blue-700 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="leading-relaxed">
                      Final total is subject to delivery address verification at
                      checkout.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t shadow-2xl z-50 px-4 py-4 safe-area-bottom">
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
              Total
            </span>
            <span className="text-xl font-black text-primary truncate">
              ₦{getTotals().total.toLocaleString()}
            </span>
          </div>
          <Button
            size="lg"
            className="flex-1 max-w-[200px] h-12 font-bold"
            onClick={() => router.push("/checkout")}
          >
            Checkout
          </Button>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all items? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
