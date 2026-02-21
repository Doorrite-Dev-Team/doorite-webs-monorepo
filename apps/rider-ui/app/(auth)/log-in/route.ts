// import { NextResponse } from "next/server";
// import axios, { AxiosResponse } from "axios";
// import cookie from "cookie";

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1";
// const isProd = process.env.NODE_ENV === "production";

// function parseError(err: unknown): { message: string; status?: number } {
//   if (axios.isAxiosError<{ error: string; status: number }>(err)) {
//     const data = err.response?.data as Record<string, unknown> | undefined;
//     const msg =
//       typeof data?.error === "string" && data.error ? data.error : err.message;
//     return { message: msg, status: err.response?.status };
//   }
//   if (err instanceof Error) return { message: err.message };
//   return { message: String(err) };
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // Proxy request to backend
//     const apiRes: AxiosResponse = await axios.post(
//       `${API_BASE}/auth/login-user`,
//       body,
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       }
//     );

//     const backendCookies = apiRes.headers["set-cookie"];
//     const response = NextResponse.json(apiRes.data, { status: apiRes.status });

//     // Mirror backend cookies to the frontend
//     if (backendCookies) {
//       const cookies = Array.isArray(backendCookies)
//         ? backendCookies
//         : [backendCookies];

//       for (const c of cookies) {
//         const parsed = cookie.parse(c);
//         for (const [name, value] of Object.entries(parsed)) {
//           response.cookies.set({
//             name,
//             value: value ?? "",
//             httpOnly: true,
//             secure: isProd,
//             sameSite: "lax",
//             path: "/",
//             maxAge: 7 * 24 * 60 * 60,
//           });
//         }
//       }
//     }

//     // Manually persist JWT token if backend includes it in response data
//     if (
//       apiRes.data &&
//       typeof apiRes.data === "object" &&
//       "token" in apiRes.data
//     ) {
//       response.cookies.set({
//         name: "authToken",
//         value: String(apiRes.data.token ?? ""),
//         httpOnly: true,
//         secure: isProd,
//         sameSite: "lax",
//         path: "/",
//         maxAge: 7 * 24 * 60 * 60,
//       });
//     }

//     return response;
//   } catch (err) {
//     console.error("[LOGIN PROXY ERROR]", err);
//     const { message, status } = parseError(err);
//     return NextResponse.json(
//       { status: "error", message },
//       { status: status ?? 500 }
//     );
//   }
// }

// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1";
// const isProd = process.env.NODE_ENV === "production";

export async function POST(req: Request) {
  const body = await req.json();

  const apiRes = await axios.post(`${API_BASE}/auth/login-user`, body, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const backendCookies = apiRes.headers["set-cookie"];
  const res = NextResponse.json(apiRes.data, { status: apiRes.status });

  if (backendCookies) {
    backendCookies.forEach((c) => {
      // Directly set the full raw cookie string
      res.headers.append("set-cookie", c);
    });
  }

  return res;
}
