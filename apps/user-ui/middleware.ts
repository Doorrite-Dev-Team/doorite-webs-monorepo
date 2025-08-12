import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("ACCESS_TOKEN")?.value;

  // Visiting root `/`
  if (req.nextUrl.pathname === "/") {
    if (token) {
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
