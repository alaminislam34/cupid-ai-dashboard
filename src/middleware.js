// middleware.js (Root Directory তে)

import { NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const LOGIN_ROUTE = "/login";
const ACCESS_TOKEN_NAME = "accessToken";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_TOKEN_NAME);
  console.log(accessToken);
  if (PROTECTED_ROUTES.includes(pathname)) {
    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_ROUTE;
      return NextResponse.redirect(url);
    }
  }

  if (pathname === LOGIN_ROUTE && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
