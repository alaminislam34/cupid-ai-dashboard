// proxy.js
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const authPages = ["/login", "/register"];
  const publicAssets = ["/_next/", "/images/", "/icons/", "/favicon.ico"];

  // Allow static assets
  if (publicAssets.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Root access should redirect based on auth state
  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in & trying to access auth pages → redirect to dashboard
  if (accessToken && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If NOT logged in & trying to access protected routes
  if (!accessToken && !authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};
