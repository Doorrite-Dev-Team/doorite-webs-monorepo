export class CartService {
  // Check if adding an item would require vendor switch
  static checkVendorConflict(
    cart: CartItem[],
    vendorId: string,
  ): { hasConflict: boolean; currentVendor: string | null } {
    if (cart.length === 0) {
      return { hasConflict: false, currentVendor: null };
    }

    const firstVendor = cart[0]?.vendorId;
    const hasConflict = firstVendor && firstVendor !== vendorId;

    return {
      hasConflict: !!hasConflict,
      currentVendor: firstVendor ?? null,
    };
  }

  // Add item to cart
  static addItem(cart: CartItem[], newItem: CartItem): CartItem[] {
    const existingItem = cart.find((item) => item.id === newItem.id);

    if (existingItem) {
      return this.updateQuantity(
        cart,
        existingItem.id,
        existingItem.quantity + 1,
      );
    } else {
      return [...cart, { ...newItem, quantity: 1 }];
    }
  }

  // Update item quantity
  static updateQuantity(
    cart: CartItem[],
    itemId: string,
    quantity: number,
  ): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(cart, itemId);
    }

    return cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );
  }

  // Remove item from cart
  static removeItem(cart: CartItem[], itemId: string): CartItem[] {
    return cart.filter((item) => item.id !== itemId);
  }

  // Clear cart
  static clearCart(): CartItem[] {
    return [];
  }

  // Calculate cart totals
  static calculateTotals(cart: CartItem[]) {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = cart.length > 0 ? 3.99 : 0;
    const serviceFee = cart.length > 0 ? 1.99 : 0;
    const total = subtotal + deliveryFee + serviceFee;

    return {
      subtotal,
      deliveryFee,
      serviceFee,
      total,
    };
  }

  // Group items by vendor
  static groupItemsByVendor(cart: CartItem[]): Record<string, CartItem[]> {
    const groups: Record<string, CartItem[]> = {};

    cart.forEach((item) => {
      const vendor = item.vendorId || "Unknown Vendor";
      if (!groups[vendor]) {
        groups[vendor] = [];
      }
      groups[vendor].push(item);
    });

    return groups;
  }
}
