import { atom } from "jotai";

const initialcart: CartItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 12.99,
    quantity: 1,
    vendor_name: "Burger Palace",
  },
  {
    id: 2,
    name: "Large Fries",
    price: 8.99,
    quantity: 2,
    vendor_name: "Burger Palace",
  },
  {
    id: 3,
    name: "Crispy Chicken Sandwich",
    price: 14.99,
    quantity: 1,
    vendor_name: "Chicken Co.",
  },
  {
    id: 4,
    name: "Coke",
    price: 3.99,
    quantity: 2,
    vendor_name: "Burger Palace",
  },
];
export const cartAtom = atom<CartItem[]>(initialcart);

export const totalCartAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.length;
});

export const totalPriceAtom = atom((get) => {
  const cart = get(cartAtom);

  return cart.map((p) => p.price).reduce((a, b) => a + b, 0);
});

export const EmptyCartAtom = atom(null, (_, set) => {
  set(cartAtom, []);
});
