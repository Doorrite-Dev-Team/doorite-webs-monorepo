// ============================================================================
// LOGIN ROUTE (EXPLICIT COOKIE SETTER)
// ============================================================================

// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, API_CONFIG } from "@/configs/api";

export async function POST(req: NextRequest) {
  try {
    // 1. Safe JSON parsing
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

    const response = await fetch(`${API_CONFIG.baseUrl}/auth/login-user`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(
      {
        ok: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? undefined : data?.message || "Login failed",
      },
      { status: response.status },
    );

    // 2. Robust Cookie Forwarding
    // getSetCookie() is the modern way to get an array of cookies
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      // Optional: nextResponse.headers.append('set-cookie', cleanCookie(cookie));
      nextResponse.headers.append("set-cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
