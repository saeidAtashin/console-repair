import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REDIRECT_PREFIXES = [
  "/repair",
  "/services",
  "/tracking",
  "/issues",
  "/consoles",
  "/dashboard",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/dashboard/, "/account") || "/account";
    return NextResponse.redirect(url, 301);
  }

  for (const prefix of REDIRECT_PREFIXES) {
    if (prefix === "/dashboard") continue;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = "/shop";
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/repair/:path*",
    "/services/:path*",
    "/tracking/:path*",
    "/issues/:path*",
    "/consoles/:path*",
    "/dashboard/:path*",
  ],
};
