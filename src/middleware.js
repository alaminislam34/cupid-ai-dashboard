// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Cookie check
  const accessToken = request.cookies.get("accessToken")?.value;

  // Public routes (no auth needed)
  const publicRoutes = ["/login", "/register"];

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user NOT logged in → redirect to /login
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated → allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login
     * - /register
     * - static files
     * - next internal paths
     */
    "/((?!_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
