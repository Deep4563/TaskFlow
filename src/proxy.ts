import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    // User is authenticated — allow through
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // Return true if user has a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
  ],
};