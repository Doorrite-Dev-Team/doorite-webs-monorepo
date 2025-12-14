"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cartAtom, totalPriceAtom } from "@/store/cartAtom";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";

export default function CartSummaryFloat() {
  const router = useRouter();
  const [cart] = useAtom(cartAtom);
  const [totalPrice] = useAtom(totalPriceAtom);
  const [isVisible, setIsVisible] = React.useState(true);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ShoppingBag className="w-6 h-6" />
                      <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Your Cart</p>
                      <p className="font-bold text-lg">
                        ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Close cart summary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white">
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  {cart.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 truncate flex-1">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-gray-900 ml-2">
                        ₦{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{cart.length - 3} more item(s)
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => router.push("/cart")}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  View Cart & Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
