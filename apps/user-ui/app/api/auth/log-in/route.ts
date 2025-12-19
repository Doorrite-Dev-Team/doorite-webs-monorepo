// ============================================================================
// LOGIN ROUTE (EXPLICIT COOKIE SETTER)
// ============================================================================

// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  extractSetCookies,
  createErrorResponse,
  API_CONFIG,
} from "@/libs/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.identifier || !body.password) {
      return Response.json(
        {
          ok: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_CONFIG.baseUrl}/auth/login-user`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    // console.log(data);

    const nextResponse = NextResponse.json(
      {
        ok: response.ok,
        ...(response.ok
          ? { data }
          : { message: data?.message || "Login failed", details: data }),
      },
      { status: response.status },
    );

    // Forward authentication cookies
    const setCookies = extractSetCookies(response);
    setCookies.forEach((cookie) => {
      nextResponse.headers.append("set-cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("[Login] Error:", error);
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
