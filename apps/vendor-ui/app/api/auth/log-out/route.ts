// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, API_CONFIG, createErrorResponse } from "@/configs/api";

export async function POST(req: NextRequest) {
  try {
    // 1. Notify backend (optional, but good practice to kill session server-side)
    // We don't wait for the result to determine success for the frontend user
    await fetch(`${API_CONFIG.baseUrl}/auth/logout-vendor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "", // Forward auth to backend
      },
    });

    const nextResponse = NextResponse.json(
      { ok: true, message: "Logged out successfully" },
      { status: 200 },
    );

    // 2. EXPLICITLY DELETE COOKIES
    // This overrides whatever the backend says and ensures frontend cleanup
    nextResponse.cookies.delete(COOKIE_NAME.ACCESS);
    // nextResponse.cookies.delete(COOKIE_NAME.REFRESH);

    return nextResponse;
  } catch (error) {
    console.error("[Logout] Error:", error);
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
