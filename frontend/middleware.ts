import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/checkout",
  "/orders",
  "/profile",
  "/wishlist",
];

// Routes that require admin role
const ADMIN_ROUTES = [
  "/admin",
];

// Routes that require seller role
const SELLER_ROUTES = [
  "/seller",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth state from cookies
  const authCookie = request.cookies.get("nexmart-auth-status");
  const roleCookie = request.cookies.get("nexmart-auth-role");

  const isAuthenticated = authCookie?.value === "true";
  const userRole = roleCookie?.value || "customer";

  // Check admin-only routes
  if (ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    if (!isAuthenticated) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "admin") {
      // Not an admin — redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check seller-only routes
  if (SELLER_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    if (!isAuthenticated) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    if (userRole !== "seller" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check general protected routes
  if (PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    if (!isAuthenticated) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
    "/seller/:path*",
  ],
};
