// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    getCookieHeader,
    extractSetCookies,
    createErrorResponse,
    API_CONFIG,
} from "@/libs/api-utils";

export async function POST(req: NextRequest) {
    try {
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
            `${API_CONFIG.baseUrl}/auth/refresh-rider-token`,
            {
                body,
                method: "POST",
                headers: {
                    cookie: cookieHeader,
                    "Content-Type": "application/json",
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
