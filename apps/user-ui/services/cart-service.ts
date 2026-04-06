export class CartService {
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

  static addItem(
    cart: CartItem[],
    newItem: AddToCartInput | CartItem,
  ): CartItem[] {
    const modifiersMatch = (
      a?: CartItem["modifiers"],
      b?: CartItem["modifiers"],
    ) => {
      const arrA = a || [];
      const arrB = b || [];
      if (arrA.length !== arrB.length) return false;
      return arrA.every((mod) => {
        return arrB.some(
          (bmod) =>
            bmod.modifierOptionId === mod.modifierOptionId &&
            bmod.modifierGroupId === mod.modifierGroupId,
        );
      });
    };

    const normalizedItem = this.normalizeToCartItem(newItem);
    const productId = normalizedItem.id;

    const existingItem = cart.find((item) => {
      if (item.id !== productId) return false;
      if (
        normalizedItem.variantId &&
        item.variantId !== normalizedItem.variantId
      )
        return false;
      const itemMods = item.modifiers;
      const newItemMods = normalizedItem.modifiers;
      if (!modifiersMatch(itemMods, newItemMods)) return false;
      return true;
    });

    if (existingItem) {
      return this.updateQuantity(
        cart,
        existingItem.id,
        existingItem.quantity + 1,
        existingItem.variantId,
      );
    }

    return [...cart, normalizedItem];
  }

  private static normalizeToCartItem(
    item: AddToCartInput | CartItem,
  ): CartItem {
    if ("productId" in item) {
      const modifiersTotal =
        item.modifiers?.reduce(
          (sum, g) =>
            sum + g.selectedOptions.reduce((s, o) => s + o.priceAdjustment, 0),
          0,
        ) ?? 0;
      return {
        id: item.productId,
        name: item.productName,
        price: item.basePrice + modifiersTotal,
        quantity: item.quantity,
        vendorName: item.vendorName,
        vendorId: item.vendorId,
        imageUrl: item.imageUrl,
        vendorDeliveryFee: item.vendorDeliveryFee ?? 0,
        variantId: item.variantId,
        variantName: item.variantName,
        modifiers: item.modifiers?.flatMap((g) =>
          g.selectedOptions.map((o) => ({
            modifierGroupId: g.modifierGroupId,
            modifierOptionId: o.modifierOptionId,
            name: o.name,
            price: o.priceAdjustment,
          })),
        ),
      };
    }
    return item;
  }

  static updateQuantity(
    cart: CartItem[],
    itemId: string,
    quantity: number,
    variantId?: string,
  ): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(cart, itemId, variantId);
    }

    return cart.map((item) => {
      if (item.id !== itemId) return item;
      if (variantId && item.variantId !== variantId) return item;
      return { ...item, quantity };
    });
  }

  static removeItem(
    cart: CartItem[],
    itemId: string,
    variantId?: string,
  ): CartItem[] {
    return cart.filter((item) => {
      if (item.id !== itemId) return true;
      if (variantId && item.variantId !== variantId) return true;
      return false;
    });
  }

  static clearCart(): CartItem[] {
    return [];
  }

  static calculateTotals(cart: CartItem[]) {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = cart.length > 0 ? (cart[0]?.vendorDeliveryFee ?? 0) : 0;
    const smallOrderFee = subtotal > 0 && subtotal < 2000 ? 200 : 0;
    const total = subtotal + deliveryFee + smallOrderFee;

    return {
      subtotal,
      deliveryFee,
      smallOrderFee,
      total,
    };
  }

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
