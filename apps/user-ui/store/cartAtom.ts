import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Persisted atom
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

export const totalCartAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((acc, item) => acc + item.quantity, 0);
});

export const totalPriceAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

export const EmptyCartAtom = atom(null, (_, set) => {
  set(cartAtom, []);
});

export const hasConflict = atom<VendorConflictModalProps | null>(null);

export interface VendorConflictModalProps {
  isOpen: boolean;
  currentVendor: string | null;
  newVendor: string;
  onContinueWithCart: () => void;
  onSwitchVendor: () => void;
  onCancel: () => void;
}
