import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("ACCESS_TOKEN")?.value;

  // Visiting root `/`
  if (req.nextUrl.pathname === "/") {
    if (token) {
      // Redirect to internal home
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      // Redirect to landing page
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Optional: run only for `/`
export const config = {
  matcher: ["/"],
};
