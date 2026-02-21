import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/configs/api";

// Define exact public paths
const PUBLIC_ROUTES = [
  "/log-in",
  "/sign-up",
  "/continue",
  "/",
  "/pending-approval",
  "/terms",
  "/privacy",
];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // 1. Check if the current path is public
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // 2. Check for token (Middleware uses request.cookies, not next/headers)
  const hasToken = request.cookies.has(COOKIE_NAME.ACCESS);
  const hasRefreshToken = request.cookies.has(COOKIE_NAME.REFRESH);

  // 3. Redirect logic: Protected Route + No Token -> Login
  if (!isPublicRoute && !hasToken && hasRefreshToken) {
    const loginUrl = new URL("/log-in", request.url);
    // Optional: Add ?from=/current-path to redirect back after login
    loginUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Redirect logic: Protected Route + No Token + No Refresh Token -> Sign up
  if (!isPublicRoute && !hasToken && !hasRefreshToken) {
    const signUpUrl = new URL("/sign-up", request.url);
    // Optional: Add ?from=/current-path to redirect back after login
    signUpUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(signUpUrl);
  }

  // 5. Redirect logic: Protected Route + Token -> Dashboard
  if (isPublicRoute && hasToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Optimization: Exclude API routes, static assets, images, and favicon
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets/).*)"],
};
