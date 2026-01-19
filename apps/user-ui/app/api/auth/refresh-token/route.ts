// // import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import axios, { AxiosResponse } from "axios";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1";
// const isProd = process.env.NODE_ENV === "production";
// // const isProd = process.env.NODE_ENV === "production";

// export async function POST(req: Request) {
//   const body = await req.json();

//   // Use a type assertion to specify the return type of the API call
//   const apiRes = (await axios.post(
//     `${API_BASE}/auth/refresh-user-token`,
//     body,
//     {
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true,
//       validateStatus: () => true,
//     },
//   )) as AxiosResponse; // \U0001f448 Assert the type here

//   const nextRes = NextResponse.json(apiRes.data, { status: apiRes.status });

//   const setCookieHeader = apiRes.headers["set-cookie"];

//   if (setCookieHeader) {
//     const cookies = Array.isArray(setCookieHeader)
//       ? setCookieHeader
//       : [setCookieHeader];

//     for (const sc of cookies) {
//       if (!sc) continue;
//       const c = sc.split(";")[0];
//       if (!c) continue;
//       const [name, value] = c.split("=");
//       if (!name || !value) continue;

//       nextRes.cookies.set({
//         name,
//         value: value || "",
//         httpOnly: true,
//         secure: isProd,
//         sameSite: "lax",
//         path: "/",
//         maxAge: 7 * 24 * 60 * 60, // 7 days
//       });
//     }
//   }

//   return nextRes;
// }

// ============================================================================
// REFRESH ROUTE (EXPLICIT COOKIE SETTER)
// ============================================================================

// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { API_CONFIG } from "@/lib/api-config";
import {
  getCookieHeader,
  extractSetCookies,
  createErrorResponse,
  API_CONFIG,
} from "@/libs/api-utils";

export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    const cookieHeader = await getCookieHeader();

    // if (!body.refresh) {
    //   return Response.json(
    //     {
    //       ok: false,
    //       message: "Please Provide Refresh Token",
    //     },
    //     { status: 400 },
    //   );
    // }

    if (!cookieHeader) {
      console.log("WHat on Earth is Happening!!!");
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
      console.log("WHat on Earth is Happening!!!");
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
      `${API_CONFIG.baseUrl}/auth/refresh-user-token`,
      {
        body,
        method: "POST",
        headers: {
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
              details: data,
            }),
      },
      { status: response.status },
    );

    // Forward new authentication cookies
    const setCookies = extractSetCookies(response);
    setCookies.forEach((cookie) => {
      nextResponse.headers.append("set-cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("[Refresh] Error:", error);
    return createErrorResponse(error);
  }
}

export const dynamic = "force-dynamic";
