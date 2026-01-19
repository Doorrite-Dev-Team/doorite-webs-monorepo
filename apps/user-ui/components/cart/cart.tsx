// components/CartWidget.tsx
"use client";

import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Store,
  X,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WithCount } from "../ui/withBadge";

// UI Imports
import { Button } from "@repo/ui/components/button";
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
import { useCart } from "@/hooks/use-cart";

export default function CartWidget() {
  const [open, setOpen] = useState(false);
  // const [cartCount] = useAtom(totalCartAtom);
  const { itemCount } = useCart();

  return (
    <>
      {/* Cart Trigger Button */}
      <button
        aria-label="Shopping cart"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="p-2 hover:bg-primary/10 rounded-full bg-transparent border-none cursor-pointer transition-colors relative"
      >
        <WithCount count={itemCount} Icon={ShoppingCart} />
      </button>

      {/* Drawer Overlay & Panel */}
      {open && <CartDrawer onCloseAction={() => setOpen(false)} />}
    </>
  );
}

/* ----------------- Cart Drawer Component ----------------- */

export function CartDrawer({ onCloseAction }: { onCloseAction: () => void }) {
  const router = useRouter();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const { cart, clearCart, updateQuantity, getTotals, getGroupedItems } =
    useCart();

  const handleCheckout = () => {
    onCloseAction();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
        onClick={onCloseAction}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-md bg-white shadow-2xl h-screen flex flex-col z-[1000] animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <header className="px-4 py-3 border-b bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Your Cart</h2>
            <span className="text-xs ml-1">{cart.length}</span>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="text-xs">Clear</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseAction}
              className="h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50/50 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Add some delicious items to get started!
              </p>
              <Button onClick={onCloseAction} variant="outline">
                Start Browsing
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(getGroupedItems()).map(([vendorId, items]) => (
                <div
                  key={vendorId}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  {/* Vendor Header */}
                  <div className="bg-gray-50/80 border-b px-3 py-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {vendorId}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 transition-all duration-300
                        `}
                      >
                        <div className="flex gap-3">
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-primary">
                                ₦{(item.price * item.quantity).toFixed(2)}
                              </span>

                              {/* Controls */}
                              <div className="flex items-center gap-2 bg-gray-100 rounded-md p-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-sm hover:bg-white shadow-sm"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-xs font-medium w-4 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-sm hover:bg-white shadow-sm"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* FOOTER */}
        {cart.length > 0 && (
          <footer className="bg-white border-t p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-20">
            {/* Summary Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{getTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>₦{getTotals().deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>₦{getTotals().serviceFee.toFixed(2)}</span>
              </div>
              <div className="my-2">
                <div className="w-full h-px bg-gray-200" />
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₦{getTotals().total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-2">
              <Button
                className="w-full bg-primary text-white font-semibold"
                size="lg"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded text-center">
                <AlertCircle className="w-3 h-3" />
                <span>Taxes calculated at next step</span>
              </div>
            </div>
          </footer>
        )}
      </aside>

      {/* Clear Cart Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="z-[1100]">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all items? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
