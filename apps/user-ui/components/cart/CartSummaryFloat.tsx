"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cartAtom, totalPriceAtom } from "@/store/cartAtom";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";

export default function CartSummaryFloat() {
  const router = useRouter();
  const [cart] = useAtom(cartAtom);
  const [totalPrice] = useAtom(totalPriceAtom);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isMinimized, setIsMinimized] = React.useState(false);

  const totalItems = React.useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  // Auto-show when items are added
  React.useEffect(() => {
    if (cart.length > 0) {
      setIsVisible(true);
    }
  }, [cart.length]);

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
            {/* Minimized View */}
            {isMinimized ? (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ShoppingBag className="w-6 h-6" />
                        <Badge className="absolute -top-2 -right-2 bg-white text-primary h-5 w-5 flex items-center justify-center p-0 text-xs font-bold">
                          {totalItems}
                        </Badge>
                      </div>
                      <span className="font-bold text-lg">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
                  </button>
                </CardContent>
              </motion.div>
            ) : (
              // Expanded View
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ShoppingBag className="w-6 h-6" />
                        <Badge className="absolute -top-2 -right-2 bg-white text-primary h-5 w-5 flex items-center justify-center p-0 text-xs font-bold">
                          {totalItems}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Your Cart</p>
                        <p className="font-bold text-xl">
                          ₦{totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        aria-label="Minimize cart"
                      >
                        <ChevronRight className="w-5 h-5 rotate-90" />
                      </button>
                      <button
                        onClick={() => setIsVisible(false)}
                        className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        aria-label="Close cart summary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="opacity-80">Items:</span>
                      <span className="font-semibold">{totalItems}</span>
                    </div>
                    <div className="h-3 w-px bg-white/30" />
                    <div className="flex items-center gap-1">
                      <span className="opacity-80">Total:</span>
                      <span className="font-semibold">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cart Items Preview */}
                <div className="p-4 bg-white">
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                    {cart.slice(0, 4).map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Badge
                            variant="secondary"
                            className="font-bold text-xs"
                          >
                            {item.quantity}x
                          </Badge>
                          <span className="text-gray-700 truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900 ml-2 whitespace-nowrap">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                    {cart.length > 4 && (
                      <p className="text-xs text-gray-500 text-center py-2 border-t">
                        +{cart.length - 4} more item
                        {cart.length - 4 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push("/cart")}
                      className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      View Cart & Checkout
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>

                    <button
                      onClick={() => setIsVisible(false)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
