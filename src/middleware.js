// middleware.js or middleware.ts
import { NextResponse } from 'next/server';
 
export function middleware(request) {
  // Example: Redirect unauthenticated users to a login page
  const isAuthenticated = request.cookies.has('accessToken'); // Replace with your actual auth check
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}
 
// Optional: Define a matcher to specify paths where middleware should run
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};