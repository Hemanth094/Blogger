// middleware.js
//
// MIDDLEWARE — The "security guard" of the application.
// This runs BEFORE any request reaches the page.
// We use it to protect the /admin area from unauthorized access.

import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Only run this check for /admin routes
  // But EXCLUDE the login page and the login API, or we'll get an infinite loop!
  if (pathname.startsWith("/admin")) {
    
    // Check for the session cookie
    const session = request.cookies.get("blogger_auth_session");

    // If no session cookie exists, redirect to the login page
    if (!session || session.value !== "authenticated") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For all other routes (or if authenticated), let the request continue
  return NextResponse.next();
}

// Optimization: Tell Next.js only to run this middleware on /admin routes
export const config = {
  matcher: "/admin/:path*",
};
