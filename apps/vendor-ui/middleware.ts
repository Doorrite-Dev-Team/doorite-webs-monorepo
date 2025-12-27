import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/configs/api"; // Import from the new safe file

// Define exact public paths
const PUBLIC_ROUTES = ["/log-in", "/sign-up", "/continue", "/"];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // 1. Check if the current path is public
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // 2. Check for token (Middleware uses request.cookies, not next/headers)
  const hasToken = request.cookies.has(COOKIE_NAME.ACCESS);

  // 3. Redirect logic: Protected Route + No Token -> Login
  if (!isPublicRoute && !hasToken) {
    const loginUrl = new URL("/log-in", request.url);
    // Optional: Add ?from=/current-path to redirect back after login
    loginUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Optimization: Exclude API routes, static assets, images, and favicon
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
