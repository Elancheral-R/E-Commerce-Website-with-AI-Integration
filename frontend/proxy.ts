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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth state from Zustand's persisted cookie/localStorage
  // Zustand persist writes to localStorage — we read it from the cookie store approach:
  // Since Next.js middleware can't read localStorage, we store a simple auth cookie on login.
  const authCookie = request.cookies.get("nexmart-auth-status");
  const roleCookie = request.cookies.get("nexmart-auth-role");

  const isAuthenticated = authCookie?.value === "true";
  const userRole = roleCookie?.value || "customer";

  // Check admin-only routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
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
  if (SELLER_ROUTES.some((route) => pathname.startsWith(route))) {
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
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
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
