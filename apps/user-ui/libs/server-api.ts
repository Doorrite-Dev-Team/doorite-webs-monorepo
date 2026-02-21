// lib/server-api-direct.ts
// import { cookies } from "next/headers";
import { API_CONFIG, getCookieHeader } from "./api-utils";

/**
 * Direct server-to-external-API client (bypasses proxy)
 * Trade-offs:
 * ✅ Slightly faster (one less hop)
 * ✅ Lower memory usage
 * ❌ Duplicates refresh logic
 * ❌ Must maintain two implementations
 * ❌ Inconsistent error handling
 *
 * Use only if performance is critical and you're willing to maintain duplication
 */

interface ServerApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export async function serverFetch<T = any>(
  path: string,
  options: ServerApiOptions = {},
  retry = false,
): Promise<T> {
  const { method = "GET", body, headers = {}, cache = "no-store" } = options;

  const cookieHeader = await getCookieHeader();
  const token = await getCookieHeader(true);

  const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(cookieHeader && { cookie: cookieHeader }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache,
  });

  // Handle token refresh (DUPLICATE LOGIC - must stay in sync with proxy)
  if (response.status === 401 && !retry) {
    const refreshResponse = await fetch(
      `${API_CONFIG.baseUrl}/auth/refresh-user-token`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(cookieHeader && { cookie: cookieHeader }),
        },
        credentials: "include",
      },
    );

    if (refreshResponse.ok) {
      // Retry original request
      return serverFetch(path, options, true);
    }

    throw new Error("Session expired");
  }

  const data = await response.json();

  // console.log(data);

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
