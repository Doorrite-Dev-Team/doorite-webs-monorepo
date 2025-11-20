export const calculateTotal = (cart: CartItem[]) => {
  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const total = +(subtotal + deliveryFee).toFixed(2);

  return {
    subtotal,
    deliveryFee,
    total,
  };
};
