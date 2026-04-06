import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    // FIX: Changed 'nextquery' to 'nextUrl'
    const path = req.nextUrl.pathname;

    // Prevent cross-dashboard access
    if (path.startsWith("/dashboard/founder") && token?.role !== "FOUNDER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/dashboard/auditor") && token?.role !== "AUDITOR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/dashboard/qa") && token?.role !== "QA_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };