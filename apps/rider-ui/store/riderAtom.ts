// store/riderAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface AuthRider {
    id: string;
    email: string;
    fullName: string;
    /** Alias – the API may return `name` instead of `fullName` */
    name?: string;
    phoneNumber?: string;
    phone?: string;
    vehicleType?: string;
    isAvailable?: boolean;
    profileImage?: string;
    rating?: number;
}

// This atom is automatically synchronized with localStorage.
export const riderAtom = atomWithStorage<AuthRider | null>(
    "logged-in-rider",
    null,
);

// A simple helper to quickly check if the user is logged in.
export const isLoggedInAtom = atom((get) => !!get(riderAtom));

// A helper to clear all user data (for logout).
export const logOutRiderAtom = atom(null, (_get, set) => {
    set(riderAtom, null);
});
