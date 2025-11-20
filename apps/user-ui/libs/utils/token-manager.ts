// utils/tokenManager.ts
"use server";
import { cookies } from "next/headers";
const ACCESS_TOKEN_KEY = "access_token";

export const tokenManager = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccess: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};

export async function isTokenExpired() {
  const myCookies = await cookies();

  const access_token = myCookies.get(ACCESS_TOKEN_KEY);

  return access_token;
}
