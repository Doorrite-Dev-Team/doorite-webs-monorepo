// app/api/auth/log-in/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG, createErrorResponse, COOKIE_NAME } from "@/libs/api-utils";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON" },
        { status: 400 },
      );
    }

    if (!body.identifier || !body.password) {
      return NextResponse.json(
        { ok: false, message: "Required fields missing" },
        { status: 400 },
      );
    }

    // Proxy the login to the external API
    const upstreamRes = await fetch(`${API_CONFIG.baseUrl}/auth/login-rider`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Read response safely (handle empty body)
    const text = await upstreamRes.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    // console.log(data);

    // Build response payload always as JSON
    const nextResponse = NextResponse.json(
      {
        ok: upstreamRes.ok,
        data: upstreamRes.ok ? data : undefined,
        message: data?.message || data?.error || "Login failed",
      },
      { status: upstreamRes.status },
    );

    // If the upstream returns tokens in the JSON, set cookies explicitly.
    if (data?.accessToken || data?.refreshToken) {
      if (data.accessToken) {
        nextResponse.cookies.set(COOKIE_NAME.ACCESS, data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
      if (data.refreshToken) {
        nextResponse.cookies.set(COOKIE_NAME.REFRESH, data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    } else {
      // Fallback
      const setCookie = upstreamRes.headers.get("set-cookie");
      if (setCookie) {
        nextResponse.headers.append("set-cookie", setCookie);
      }
    }

    return nextResponse;
  } catch (error) {
    return createErrorResponse(error);
  }
}

// export const dynamic = "force-dynamic";
