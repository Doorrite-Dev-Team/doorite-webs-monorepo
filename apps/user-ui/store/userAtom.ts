// src/store/userAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Define the User type structure based on your LoginResponse

//This atom is automatically synchronized with localStorage.
// The key is 'logged-in-user'. The initial value is 'null'.
export const userAtom = atomWithStorage<User | null>("logged-in-user", null);

//A simple helper to quickly check if the user is logged in.
export const isLoggedInAtom = atom((get) => !!get(userAtom));

//A helper to clear all user data (for logout).
export const logoutAtom = atom(null, (_get, set) => {
  set(userAtom, null);
});
