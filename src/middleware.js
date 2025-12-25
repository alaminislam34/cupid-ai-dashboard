// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Public routes & assets
  const publicPaths = ["/login", "/register", "/favicon.ico"];
  const publicAssets = ["/_next/", "/images/", "/icons/"];

  // Allow public routes
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    publicAssets.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // Redirect if not authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
