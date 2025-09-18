import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("access_role")?.value;

  // Debug logging
  console.log("Path:", path);
  console.log("Access Token:", accessToken);
  console.log("User Role:", userRole);

  // If user is not on an auth route and has no token → redirect to login
  if (path.split("/")[1] !== "auth" && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is on an auth route and logged in → redirect based on role
  if (path.split("/")[1] === "auth" && accessToken) {
    if (userRole?.toLowerCase() === "user") {
      return NextResponse.redirect(
        new URL(`/ticketing-system/tickets`, request.url)
      );
    } else if (userRole?.toLowerCase() === "guest") {
      return NextResponse.redirect(
        new URL(`/ticketing-system/guest/tickets`, request.url)
      );
    } else {
      console.log("Unknown or undefined role, redirecting to login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
