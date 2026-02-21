// configs/api.ts
import { cookies } from "next/headers";
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URI ?? "http://localhost:4000/api/v1",
  timeout: 30000,
  retryAttempts: 1,
} as const;

const ACCESS = "access_token_vendor";
const REFRESH = "refresh_token_vendor";

export const COOKIE_NAME = {
  ACCESS,
  REFRESH,
};

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
    return cookieStore.get(ACCESS)?.value ?? null;
  }

  if (refresh) {
    return cookieStore.get(REFRESH)?.value ?? null;
  }

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// export async function getAccessCookie()

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
