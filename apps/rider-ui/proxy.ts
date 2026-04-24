import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RIDER_COOKIES } from "@/libs/api-utils";

const PUBLIC_ROUTES = [
  "/login",
  "/sign-up",
  "/continue",
  "/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasAccessToken = request.cookies.has(RIDER_COOKIES.ACCESS);
  const hasRefreshToken = request.cookies.has(RIDER_COOKIES.REFRESH);

  // Root path `/` handling
  if (pathname === "/") {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!isPublicRoute && !hasAccessToken && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && hasAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets/).*)"],
};
