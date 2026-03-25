// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, API_CONFIG, createErrorResponse } from "@/libs/api-utils";

export async function POST(req: NextRequest) {
    try {
        // 1. Notify backend
        await fetch(`${API_CONFIG.baseUrl}/auth/logout-rider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: req.headers.get("cookie") || "",
            },
        });

        const nextResponse = NextResponse.json(
            { ok: true, message: "Logged out successfully" },
            { status: 200 },
        );

        // 2. EXPLICITLY DELETE COOKIES
        nextResponse.cookies.delete(COOKIE_NAME.ACCESS);
        nextResponse.cookies.delete(COOKIE_NAME.REFRESH);

        return nextResponse;
    } catch (error) {
        console.error("[Logout] Error:", error);
        return createErrorResponse(error);
    }
}

export const dynamic = "force-dynamic";
