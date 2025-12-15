// // import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import axios, { AxiosResponse } from "axios";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URI || "https://doorrite-api.onrender.com/api/v1";
// const isProd = process.env.NODE_ENV === "production";
// // const isProd = process.env.NODE_ENV === "production";

// export async function POST(req: Request) {
//   const body = await req.json();

//   // Use a type assertion to specify the return type of the API call
//   const apiRes = (await axios.post(`${API_BASE}/auth/login-user`, body, {
//     headers: { "Content-Type": "application/json" },
//     withCredentials: true,
//     validateStatus: () => true,
//   })) as AxiosResponse; // \U0001f448 Assert the type here

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
