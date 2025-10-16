// app/api/auth/[role]/log-in/route.ts
import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import cookie from "cookie";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1/";
const isProd = process.env.NODE_ENV === "production";

function parseError(err: unknown): { message: string; status?: number } {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    const msg =
      typeof data?.message === "string"
        ? data.message
        : err.message;
    return { message: msg, status: err.response?.status };
  }

  if (err instanceof Error) {
    return { message: err.message };
  }

  return { message: String(err) };
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ role: string }> }
) {
  try {
    const { role } = await ctx.params;
    const body = await req.json();

    const apiRes: AxiosResponse = await axios.post(
      `${API_BASE}/auth/${role}/log-in`,
      body,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const backendCookies = apiRes.headers["set-cookie"];
    const response = NextResponse.json(apiRes.data, { status: apiRes.status });

    if (backendCookies) {
      const cookies = Array.isArray(backendCookies)
        ? backendCookies
        : [backendCookies];

      for (const c of cookies) {
        const parsed = cookie.parse(c);
        for (const [name, value] of Object.entries(parsed)) {
          response.cookies.set({
            name,
            value: String(value ?? ""),
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }
      }
    }

    if (apiRes.data && typeof apiRes.data === "object" && "token" in apiRes.data) {
      response.cookies.set({
        name: "authToken",
        value: String((apiRes.data as Record<string, unknown>).token ?? ""),
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    const { message, status } = parseError(err);
    return NextResponse.json(
      { status: "error", message },
      { status: status ?? 500 }
    );
  }
}
