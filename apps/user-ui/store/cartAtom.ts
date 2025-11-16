import { atom } from "jotai";

export const cartAtom = atom<Product[]>([]);

export const totalCartAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.length;
});

export const totalPriceAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.map((p) => p.basePrice).reduce((a, b) => a + b, 0);
});

export const EmptyCartAtom = atom(null, (_, set) => {
  set(cartAtom, []);
});
