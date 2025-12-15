// ============================================================================
// CENTRAL PROXY ROUTE WITH IMPROVEMENTS
// ============================================================================

// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  API_CONFIG,
  getCookieHeader,
  extractSetCookies,
  createErrorResponse,
} from "@/libs/api-utils";

/**
 * Forward request to external API with automatic token refresh
 * @param req - Incoming Next.js request
 * @param retry - Whether this is a retry after refresh (prevents infinite loops)
 */

async function forwardRequest(
  req: NextRequest,
  retry = false,
): Promise<Response> {
  try {
    // Extract path segments and rebuild target URL
    const pathSegments = req.nextUrl.pathname.replace("/api/proxy", "");
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${API_CONFIG.baseUrl}${pathSegments}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Get cookies from server-side store
    const cookieHeader = await getCookieHeader();
    const accessToken = await getCookieHeader(true);

    // Prepare request body (only for mutations)
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    // Forward request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(targetUrl, {
      method: req.method,
      body: JSON.stringify(body),
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(cookieHeader && { cookie: cookieHeader }),
        // Forward relevant headers
        ...(req.headers.get("accept") && {
          accept: req.headers.get("accept")!,
        }),
      },
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 with automatic token refresh (once)
    if (response.status === 401 && !retry) {
      console.log("[Proxy] Access token expired, attempting refresh...");

      if (!cookieHeader) {
        return Response.json(
          {
            ok: false,
            message: "No refresh token found",
            code: "NO_REFRESH_TOKEN",
          },
          { status: 401 },
        );
      }

      const refreshResponse = await fetch(
        `${req.nextUrl.origin}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            cookie: cookieHeader,
          },
          credentials: "include",
        },
      );

      if (refreshResponse.ok) {
        console.log("[Proxy] Token refresh successful, retrying request");
        // Retry original request with refreshed token
        return forwardRequest(req, true);
      } else {
        console.log("[Proxy] Token refresh failed");
        // Return 401 to trigger client-side logout
        return Response.json(
          {
            ok: false,
            message: "Session expired. Please log in again.",
            code: "SESSION_EXPIRED",
          },
          { status: 401 },
        );
      }
    }

    // Parse response body
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Create Next.js response with standardized shape
    const nextResponse = NextResponse.json(
      {
        ok: response.ok,
        ...(response.ok
          ? { data }
          : {
              message:
                data?.message ||
                `Request failed with status ${response.status}`,
              details: data,
            }),
      },
      { status: response.status },
    );

    // Forward Set-Cookie headers (preserves HttpOnly, Secure, etc.)
    const setCookies = extractSetCookies(response);
    setCookies.forEach((cookie) => {
      nextResponse.headers.append("set-cookie", cookie);
    });

    return nextResponse;
  } catch (error: any) {
    console.error("[Proxy] Request failed:", error);

    if (error.name === "AbortError") {
      return createErrorResponse({ message: "Request timeout" }, 504);
    }

    return createErrorResponse(error);
  }
}

// Export HTTP method handlers
export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;

// Disable static optimization for this route
export const dynamic = "force-dynamic";
