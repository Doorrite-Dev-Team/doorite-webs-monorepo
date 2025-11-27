import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value;
  const request_token = req.cookies.get("request_token")?.value;

  // Visiting root `/`
  if (req.nextUrl.pathname === "/") {
    if (access_token || request_token) {
      // Redirect to internal home
      return NextResponse.rewrite(new URL("/home", req.url));
    } else {
      // rewrite to landing page
      return NextResponse.rewrite(new URL("/landing", req.url));
    }
  }

  return NextResponse.next();
}

// Optional: run only for `/`
export const config = {
  matcher: ["/"],
};
