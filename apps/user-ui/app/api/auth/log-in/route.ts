// ============================================================================
// LOGIN ROUTE (EXPLICIT COOKIE SETTER)
// ============================================================================

// // app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { createErrorResponse, API_CONFIG } from "@/libs/api-utils";

// export async function POST(req: NextRequest) {
//   try {
//     // 1. Safe JSON parsing
//     let body;
//     try {
//       body = await req.json();
//     } catch {
//       return NextResponse.json(
//         { ok: false, message: "Invalid JSON" },
//         { status: 400 },
//       );
//     }

//     if (!body.identifier || !body.password) {
//       return NextResponse.json(
//         { ok: false, message: "Required fields missing" },
//         { status: 400 },
//       );
//     }

//     const response = await fetch(`${API_CONFIG.baseUrl}/auth/login-user`, {
//       method: "POST",
//       body: JSON.stringify(body),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await response.json();

//     const nextResponse = NextResponse.json(
//       {
//         ok: response.ok,
//         data: response.ok ? data : undefined,
//         message: response.ok ? undefined : data?.message || "Login failed",
//       },
//       { status: response.status },
//     );

//     // 2. Robust Cookie Forwarding
//     // getSetCookie() is the modern way to get an array of cookies
//     const cookies = response.headers.getSetCookie();
//     cookies.forEach((cookie) => {
//       // Optional: nextResponse.headers.append('set-cookie', cleanCookie(cookie));
//       nextResponse.headers.append("set-cookie", cookie);
//     });

//     return nextResponse;
//   } catch (error) {
//     return createErrorResponse(error);
//   }
// }

// export const dynamic = "force-dynamic";

// app/api/auth/log-in/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG, createErrorResponse } from "@/libs/api-utils";

const ACCESS_TOKEN = "access_token_user";
const REFRESH_TOKEN = "refresh_token_user";

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
    const upstreamRes = await fetch(`${API_CONFIG.baseUrl}/auth/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Note: server-side fetch doesn't need credentials; cookies are handled manually below
    });

    // Read response safely (handle empty body)
    const text = await upstreamRes.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // upstream returned non-JSON text — keep raw text as message
        data = { message: text };
      }
    }

    // Build response payload always as JSON
    const nextResponse = NextResponse.json(
      {
        ok: upstreamRes.ok,
        data: upstreamRes.ok ? data : undefined,
        message: upstreamRes.ok ? undefined : data?.message || "Login failed",
      },
      { status: upstreamRes.status },
    );

    // If the upstream returns tokens in the JSON, set cookies explicitly.
    // Prefer doing this rather than forwarding Set-Cookie headers.
    // Adjust the token keys to match the upstream response shape.

    if (data?.accessToken || data?.refreshToken) {
      if (data.accessToken) {
        nextResponse.cookies.set(ACCESS_TOKEN, data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          // set maxAge or expires if upstream provides it
        });
      }
      if (data.refreshToken) {
        nextResponse.cookies.set(REFRESH_TOKEN, data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
    } else {
      // Fallback: if upstream set cookies only as headers, attempt to forward them.
      // Note: fetch's ability to expose raw 'set-cookie' may vary by runtime. This is a fallback only.
      const setCookie = upstreamRes.headers.get("set-cookie");
      if (setCookie) {
        // forward header (works if single cookie); for multiple cookies you'd need raw()
        nextResponse.headers.append("set-cookie", setCookie);
      }
    }

    return nextResponse;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
