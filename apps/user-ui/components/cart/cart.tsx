// components/CartWidget.tsx
"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WithCount } from "../withBadge";
import { cartAtom, totalCartAtom } from "@/store/cartAtom";
import { useAtom } from "jotai";
import { calculateTotal } from "@/libs/utils/cart-manager";

export default function CartWidget() {
  const [open, setOpen] = useState(false);
  const [cartLength] = useAtom(totalCartAtom);

  return (
    <>
      {/* Cart button — place this in your header/nav */}
      <button
        aria-label="Shopping cart"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className=" p-2 hover:bg-primary/10 rounded-full bg-transparent border-none cursor-pointer transition-colors"
      >
        <WithCount count={cartLength} Icon={ShoppingCart} />
      </button>

      {/* Drawer */}
      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  );
}

/* ----------------- Cart Drawer Component ----------------- */

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  // const [cart, setcart] = useState<Item[]>(initialcart);
  const [cart, setCart] = useAtom(cartAtom);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.max(0, it.quantity + delta) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const amount = calculateTotal(cart);

  return (
    // Overlay + panel
    <div className="fixed inset-0 z-[1000] flex">
      {/* Overlay */}
      <button
        aria-label="Close cart"
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
      />

      {/* Panel */}
      <aside
        className="ml-auto w-full max-w-md bg-white shadow-2xl h-screen flex flex-col z-[1000]"
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <header className="p-4 border-b">
          <div className="flex cart-center justify-between">
            <div className="flex cart-center gap-3">
              <ShoppingCart className="text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <p className="text-sm text-muted-foreground">
                  Review your cart before checkout
                </p>
              </div>
            </div>

            <div>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </header>

        {/* CONTENT: cart area (flex-1) */}
        <main className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart size={48} className="mx-auto mb-4" />
              <div>Your cart is empty</div>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((it) => (
                <Card key={it.id} className="shadow-sm">
                  <CardContent className="p-3 flex cart-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex cart-center justify-between">
                        <h4 className="font-medium truncate">{it.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          ${it.price.toFixed(2)}
                        </span>
                      </div>
                      {it.vendor_name && (
                        <div className="text-xs text-muted-foreground">
                          {it.vendor_name}
                        </div>
                      )}
                      <div className="mt-2 flex cart-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(it.id, -1)}
                          aria-label={`Decrease ${it.name}`}
                        >
                          −
                        </Button>
                        <div className="w-8 text-center">{it.quantity}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(it.id, 1)}
                          aria-label={`Increase ${it.name}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col cart-end">
                      <div className="font-semibold">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                      <Badge className="mt-2 text-xs">Item</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* ORDER SUMMARY (above footer) */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-white">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${amount.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span>${amount.deliveryFee.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${amount.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER - actions (always visible) */}
        <footer className="p-4 border-t">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue Shopping
            </Button>

            <Button
              className="flex-1 bg-primary text-white"
              onClick={() => {
                onClose();
                // navigate to checkout; using link could keep history; here we use router
                router.push("/checkout");
              }}
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
