// app/checkout/page.tsx
"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { useState } from "react";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";

type Item = { id: number; name: string; price: number; quantity: number };

export default function CheckoutPage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Classic Cheeseburger", quantity: 1, price: 12.99 },
    { id: 2, name: "Large Fries", quantity: 2, price: 8.99 },
    { id: 3, name: "Crispy Chicken Sandwich", quantity: 1, price: 14.99 },
    { id: 4, name: "Coke", quantity: 2, price: 3.99 },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "campus" | "mobile"
  >("mobile");

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems((prev) =>
      newQuantity === 0
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  };

  const itemTotal = (it: Item) => it.quantity * it.price;
  const subtotal = items.reduce((s, it) => s + itemTotal(it), 0);
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const taxes = 1.99;
  const total = +(subtotal + deliveryFee + taxes).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <Link href="/home" className="text-gray-600">
            Close
          </Link>
          <h1 className="text-lg font-semibold">Checkout</h1>
          <div className="w-6" />
        </div>

        <div className="p-4 space-y-4">
          {/* Items */}
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-3">Items</h2>
              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{it.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {it.quantity}x
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="font-medium">
                        ${itemTotal(it).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                          onClick={() =>
                            updateQuantity(it.id, Math.max(0, it.quantity - 1))
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-8 text-center">{it.quantity}</div>
                        <button
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                          onClick={() => updateQuantity(it.id, it.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-3">Delivery Address</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Campus Address</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Dormitory A, Room 201
                  </div>
                </div>
                <div className="text-gray-400">{/* chevron */}</div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-3">Payment Method</h2>
              <div className="space-y-2">
                {[
                  { key: "card", label: "Credit/Debit Card" },
                  { key: "campus", label: "Campus Card" },
                  { key: "mobile", label: "Mobile Payment" },
                ].map((m) => {
                  const key = m.key as "card" | "campus" | "mobile";
                  const active = selectedPayment === key;
                  return (
                    <div
                      key={m.key}
                      onClick={() => setSelectedPayment(key)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        active
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-5 rounded border bg-gray-100 border-gray-300 mr-3 flex items-center justify-center">
                          {/* icon placeholder */}
                        </div>
                        <div className="text-gray-900">{m.label}</div>
                      </div>
                      <div className="text-gray-400">{/* chevron */}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent>
              <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Delivery Fee</span>
                  <span className="text-gray-900">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Taxes</span>
                  <span className="text-gray-900">${taxes.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-green-600 font-semibold">Total</span>
                    <span className="text-gray-900 font-semibold text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-primary text-white py-3">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
