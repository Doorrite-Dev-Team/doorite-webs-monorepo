import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN = "access_token_user";
const REFRESH_TOKEN = "refresh_token_user";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  // console.log("-----------------", accessToken, "----------------------");
  const isAuthenticated = !!accessToken;

  // --- PATH DEFINITIONS ---

  // 1. Auth Paths: Only for GUESTS. Logged in users shouldn't see these.
  const authPaths = ["/log-in", "/sign-up", "/forget-password"];

  // 2. Public Paths: accessible by ANYONE (Guests & Users)
  const publicPaths = [
    "/landing",
    "/continue",
    "/about",
    "/privacy",
    "/terms",
    "/test",
  ];

  const isPublicOrAuth =
    authPaths.includes(pathname) || publicPaths.includes(pathname);

  // --- LOGIC ---

  // 1. Root Path `/` Handling
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.rewrite(new URL("/home", req.url));
    } else {
      return NextResponse.rewrite(new URL("/landing", req.url));
    }
  }

  // 2. Redirect Authenticated Users AWAY from Auth Pages (Login/Signup)
  if (isAuthenticated && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!isAuthenticated && refreshToken) {
    // Only redirect if they are trying to access a protected page

    if (!isPublicOrAuth) {
      const url = new URL("/log-in", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 4. Protect Private Routes
  if (!isAuthenticated && !isPublicOrAuth) {
    const url = new URL("/sign-up", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
