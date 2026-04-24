import { NextRequest, NextResponse } from "next/server";
import {
  API_CONFIG,
  getCookieHeader,
  extractSetCookies,
  createErrorResponse,
} from "@/configs/api";
import { checkRateLimit, clearRateLimit } from "@/libs/rate-limit";

export async function POST(_req: NextRequest) {
  try {
    // Rate limiting: max 5 refresh attempts per minute
    const clientIp = _req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`refresh:${clientIp}`, 5, 60 * 1000)) {
      return Response.json(
        {
          ok: false,
          message: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429 },
      );
    }

    const cookieHeader = await getCookieHeader();

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

    const refreshToken = await getCookieHeader(false, true);
    if (!refreshToken) {
      return Response.json(
        {
          ok: false,
          message: "No refresh token found",
          code: "NO_REFRESH_TOKEN",
        },
        { status: 401 },
      );
    }

    const body = JSON.stringify({
      refresh: refreshToken,
    });

    const response = await fetch(
      `${API_CONFIG.baseUrl}/auth/refresh-vendor-token`,
      {
        body,
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: cookieHeader,
        },
        credentials: "include",
      },
    );

    const data = await response.json();

    const nextResponse = NextResponse.json(
      {
        ok: response.ok,
        ...(response.ok
          ? { data }
          : {
              message: data?.message || "Token refresh failed",
            }),
      },
      { status: response.status },
    );

    const setCookies = extractSetCookies(response);
    setCookies.forEach((cookie) => {
      nextResponse.headers.append("set-cookie", cookie);
    });

    // Clear rate limit on successful refresh
    if (response.ok) {
      const clientIp = _req.headers.get("x-forwarded-for") || "unknown";
      clearRateLimit(`refresh:${clientIp}`);
    }

    return nextResponse;
  } catch (error) {
    console.error("[Refresh] Error:", error);
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
