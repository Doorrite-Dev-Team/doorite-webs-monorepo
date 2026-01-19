import { useAtom, useSetAtom } from "jotai";
import { cartAtom, hasConflict } from "@/store/cartAtom";
import { CartService } from "@/services/cart-service";

export function useCart() {
  const [cart, setCart] = useAtom(cartAtom);
  const setHasConflict = useSetAtom(hasConflict);

  const addItem = (newItem: CartItem) => {
    setHasConflict(null);
    const conflict = CartService.checkVendorConflict(cart, newItem.vendorId);

    if (conflict.hasConflict) {
      // const newCart = CartService.addItem(cart, newItem);
      // setCart(newCart);
      setHasConflict({
        isOpen: true,
        currentVendor: conflict.currentVendor,
        newVendor: newItem.vendorName,
        onContinueWithCart: () => {
          setCart(cart);
        },
        onSwitchVendor: () => {
          clearCart();
          addItem(newItem);
        },
        onCancel: () => {
          setCart(cart);
        },
      });
    } else {
      const newCart = CartService.addItem(cart, newItem);
      setCart(newCart);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + delta;

      if (newQuantity < 1) {
        const newCart = CartService.removeItem(cart, itemId);
        setCart(newCart);
      }
      const newCart = CartService.updateQuantity(cart, itemId, newQuantity);
      setCart(newCart);
    }
  };

  const removeItem = (itemId: string) => {
    const newCart = CartService.removeItem(cart, itemId);
    setCart(newCart);
  };

  const clearCart = () => {
    const newCart = CartService.clearCart();
    setCart(newCart);
  };

  const getTotals = () => {
    return CartService.calculateTotals(cart);
  };

  const getGroupedItems = () => {
    return CartService.groupItemsByVendor(cart);
  };

  return {
    cart,
    items: cart,
    isEmpty: cart.length === 0,
    itemCount: cart.length,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotals,
    getGroupedItems,
  };
}
