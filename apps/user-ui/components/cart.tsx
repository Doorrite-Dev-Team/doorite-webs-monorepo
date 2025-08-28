// components/CartWidget.tsx
"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WithCount } from "./withBadge";

type Item = {
  id: number;
  name: string;
  restaurant?: string;
  price: number;
  quantity: number;
};

const initialItems: Item[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 12.99,
    quantity: 1,
    restaurant: "Burger Palace",
  },
  {
    id: 2,
    name: "Large Fries",
    price: 8.99,
    quantity: 2,
    restaurant: "Burger Palace",
  },
  {
    id: 3,
    name: "Crispy Chicken Sandwich",
    price: 14.99,
    quantity: 1,
    restaurant: "Chicken Co.",
  },
  {
    id: 4,
    name: "Coke",
    price: 3.99,
    quantity: 2,
    restaurant: "Burger Palace",
  },
];

/*
  <button
    className="p-2 hover:bg-primary/10 rounded-full bg-transparent border-none cursor-pointer transition-colors"
    aria-label="Shopping cart"
  >
    
  </button>
*/ 

export default function CartWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Cart button — place this in your header/nav */}
      <button
        aria-label="Shopping cart"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className=" p-2 hover:bg-primary/10 rounded-full bg-transparent border-none cursor-pointer transition-colors"
      >
        <WithCount count={4} Icon={ShoppingCart} />
      </button>

      {/* Drawer */}
      {open && (
        <CartDrawer
          initialItems={initialItems}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ----------------- Cart Drawer Component ----------------- */

export function CartDrawer({
  initialItems,
  onClose,
}: {
  initialItems: Item[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.max(0, it.quantity + delta) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const taxes = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + deliveryFee + taxes).toFixed(2);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <p className="text-sm text-muted-foreground">
                  Review your items before checkout
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

        {/* CONTENT: items area (flex-1) */}
        <main className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart size={48} className="mx-auto mb-4" />
              <div>Your cart is empty</div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <Card key={it.id} className="shadow-sm">
                  <CardContent className="p-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{it.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          ${it.price.toFixed(2)}
                        </span>
                      </div>
                      {it.restaurant && (
                        <div className="text-xs text-muted-foreground">
                          {it.restaurant}
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
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
                    <div className="flex flex-col items-end">
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
        {items.length > 0 && (
          <div className="p-4 border-t bg-white">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
