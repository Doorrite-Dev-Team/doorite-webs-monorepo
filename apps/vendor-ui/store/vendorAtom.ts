// src/store/userAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface AuthVendor {
  id: string;
  email: string;
  businessName: string;
}

//This atom is automatically synchronized with localStorage.
export const vendorAtom = atomWithStorage<AuthVendor | null>(
  "logged-in-vendor",
  null,
);

//A simple helper to quickly check if the user is logged in.
export const isLoggedInAtom = atom((get) => !!get(vendorAtom));

//A helper to clear all user data (for logout).
export const logOutVendorAtom = atom(null, (_get, set) => {
  set(vendorAtom, null);
});
