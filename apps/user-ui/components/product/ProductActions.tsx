"use client";

import * as React from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { cartAtom, hasConflict } from "@/store/cartAtom";
import { Button } from "@repo/ui/components/button";
import { isVendorOpen } from "@/libs/utils";
import { CartService } from "@/services/cart-service";
// import { VendorConflictModal } from "@/components/vendor-conflict-modal";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [cart, setCart] = useAtom(cartAtom);
  const setHasConflict = useSetAtom(hasConflict);
  const [showAdded, setShowAdded] = React.useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = React.useState(false);
  const [pendingVendor, setPendingVendor] = React.useState<{
    vendorId: string;
    vendorName: string;
    newItem: CartItem;
  } | null>(null);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const addToCart = React.useCallback(() => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      vendorName: product.vendor.businessName,
      vendorId: product.vendorId,
    } as CartItem;

    const conflict = CartService.checkVendorConflict(
      cart,
      product.vendor.businessName,
    );

    if (conflict.hasConflict) {
      // Show vendor conflict modal
      setPendingVendor({
        vendorId: product.vendor.id,
        vendorName: product.vendor.businessName,
        newItem,
      });
      setIsVendorModalOpen(true);
    } else {
      // Add item directly
      const newCart = CartService.addItem(cart, newItem);
      setCart(newCart);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    }
  }, [cart, setCart, product]);

  const handleContinueWithCart = React.useCallback(() => {
    setIsVendorModalOpen(false);
    setPendingVendor(null);
  }, []);

  const handleSwitchVendor = React.useCallback(() => {
    if (pendingVendor) {
      const clearedCart = CartService.clearCart();
      const newCart = CartService.addItem(clearedCart, pendingVendor.newItem);
      setCart(newCart);
    }
    setIsVendorModalOpen(false);
    setPendingVendor(null);
  }, [pendingVendor, setCart]);

  const handleCancelVendorModal = React.useCallback(() => {
    setIsVendorModalOpen(false);
    setPendingVendor(null);
  }, []);

  const handleUpdateQuantity = React.useCallback(
    (delta: number) => {
      if (cartItem) {
        const newQuantity = cartItem.quantity + delta;
        const newCart = CartService.updateQuantity(
          cart,
          cartItem.id,
          newQuantity,
        );
        setCart(newCart);
      }
    },
    [cart, cartItem, setCart],
  );

  const isDisabled =
    !product.isAvailable ||
    !product.vendor.isActive ||
    isVendorOpen(product.vendor);

  React.useEffect(() => {
    if (isVendorModalOpen && pendingVendor) {
      setHasConflict({
        isOpen: isVendorModalOpen,
        currentVendor: cart.length > 0 ? cart[0]?.vendorName || null : null,
        newVendor: pendingVendor?.vendorName || "",
        onContinueWithCart: handleContinueWithCart,
        onSwitchVendor: handleSwitchVendor,
        onCancel: handleCancelVendorModal,
      });
    }
  }, [
    isVendorModalOpen,
    pendingVendor,
    cart,
    setHasConflict,
    handleContinueWithCart,
    handleSwitchVendor,
    handleCancelVendorModal,
  ]);

  if (quantity > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Quantity</span>
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleUpdateQuantity(-1)}
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
              onClick={() => handleUpdateQuantity(1)}
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

  // if (isVendorModalOpen && pendingVendor) {
  //   return (
  //     <VendorConflictModal
  //       isOpen={isVendorModalOpen}
  //       currentVendor={cart.length > 0 ? cart[0]?.vendorName || null : null}
  //       newVendor={pendingVendor?.vendorName || ""}
  //       onContinueWithCart={handleContinueWithCart}
  //       onSwitchVendor={handleSwitchVendor}
  //       onCancel={handleCancelVendorModal}
  //     />
  //   );
  // }

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

  // return (
  //   <>
  //     <Button
  //       size="lg"
  //       onClick={addToCart}
  //       disabled={isDisabled}
  //       className="w-full h-14 text-lg font-semibold gap-2 transition-all"
  //     >
  //       {showAdded ? (
  //         <>
  //           <Check className="w-5 h-5" />
  //           Added to Cart!
  //         </>
  //       ) : (
  //         <>
  //           <ShoppingCart className="w-5 h-5" />
  //           {isDisabled
  //             ? !product.isAvailable
  //               ? "Out of Stock"
  //               : "Vendor Closed"
  //             : "Add to Cart"}
  //         </>
  //       )}
  //     </Button>

  //     {/* Vendor conflict modal */}
  //     {isVendorModalOpen && pendingVendor && (
  //       <VendorConflictModal
  //         isOpen={isVendorModalOpen}
  //         currentVendor={
  //           cart.length > 0 ? cart[0]?.vendorName || "Unknown" : "Empty cart"
  //         }
  //         newVendor={pendingVendor?.vendorName || ""}
  //         onContinueWithCart={handleContinueWithCart}
  //         onSwitchVendor={handleSwitchVendor}
  //         onCancel={handleCancelVendorModal}
  //       />
  //     )}
  //   </>
  // );
}
