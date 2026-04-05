import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface CheckoutAddress {
  id?: string;
  address: string;
  state?: string;
  country?: string;
  coordinates: { lat: number; long: number };
}

export interface CheckoutContact {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface DeliveryInfo {
  fee: number;
  distance: number;
  estimatedTime: string;
  isCalculating: boolean;
}

export interface CheckoutState {
  selectedAddress: CheckoutAddress | null;
  contact: CheckoutContact | null;
  instructions: string;
  deliveryInfo: DeliveryInfo | null;
  paymentMethod: "PAYSTACK" | "CASH_ON_DELIVERY" | null;
}

const INITIAL: CheckoutState = {
  selectedAddress: null,
  contact: null,
  instructions: "",
  deliveryInfo: null,
  paymentMethod: null,
};

export const checkoutAtom = atomWithStorage<CheckoutState>(
  "doorrite-checkout",
  INITIAL,
  {
    getItem: (key, init) => {
      try {
        const val = sessionStorage.getItem(key);
        return val ? JSON.parse(val) : init;
      } catch {
        return init;
      }
    },
    setItem: (key, val) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(val));
      } catch {}
    },
    removeItem: (key) => {
      try {
        sessionStorage.removeItem(key);
      } catch {}
    },
  },
);

export const clearCheckoutAtom = atom(null, (_get, set) => {
  set(checkoutAtom, INITIAL);
});
