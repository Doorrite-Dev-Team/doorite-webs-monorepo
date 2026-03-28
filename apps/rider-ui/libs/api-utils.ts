// libs/api-utils.ts
import { cookies } from "next/headers";

export const RIDER_COOKIES = {
  ACCESS: "access_token_rider",
  REFRESH: "refresh_token_rider",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login-rider",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    REGISTER: "/auth/register-rider",
  },
  RIDERS: {
    PROFILE: "/riders/profile",
    UPDATE_LOCATION: "/riders/update-location",
    AVAILABILITY: "/riders/availability",
  },
  ORDERS: {
    LIST: "/orders",
    DETAILS: "/orders/:id",
    ACCEPT: "/orders/:id/accept",
    COMPLETE: "/orders/:id/complete",
    CANCEL: "/orders/:id/cancel",
  },
  EARNINGS: {
    SUMMARY: "/earnings/summary",
    TRANSACTIONS: "/earnings/transactions",
  },
} as const;

export { RIDER_COOKIES as COOKIE_NAME };

export const API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URI ??
    "https://doorrite-api.onrender.com/api/v1",
  timeout: 30000,
  retryAttempts: 1,
} as const;

/**
 * Builds cookie header from Next.js cookie store
 * Single source of truth for cookie serialization
 */
export async function getCookieHeader(
  access?: boolean,
  refresh?: boolean,
): Promise<string | null> {
  const cookieStore = await cookies();

  if (access) {
    return cookieStore.get(RIDER_COOKIES.ACCESS)?.value ?? null;
  }

  if (refresh) {
    return cookieStore.get(RIDER_COOKIES.REFRESH)?.value ?? null;
  }

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

/**
 * Extracts and parses Set-Cookie headers from response
 */
export function extractSetCookies(response: Response): string[] {
  const setCookies: string[] = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      setCookies.push(value);
    }
  });
  return setCookies;
}

/**
 * Creates standardized API error response
 */
export function createErrorResponse(
  error: any,
  status: number = 500,
): Response {
  return Response.json(
    {
      ok: false,
      message: error?.message || "An error occurred",
      details: error,
    },
    { status },
  );
}
