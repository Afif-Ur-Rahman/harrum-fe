import { NextResponse, type NextRequest } from "next/server";
import { getAuthCookies } from "@/utils/cookies";
import { createHeaders } from "./api";
import { API_URL } from "./constants";

const PUBLIC_PATHS = [
  "/terms-and-conditions",
  "/privacy-policy",
  "/menu",      // Customer-facing table menu (QR code destination)
  "/chatbot",   // Customer-facing AI ordering
  // Dynamic restaurant public routes — must stay unauthenticated
  // Note: static app routes (/restaurant, /chef, /waiter, etc.) take precedence in Next.js
];

// Username-based public routes: /[username], /[username]/table/[tableId], /[username]/order
const USERNAME_PUBLIC_RE = /^\/[^/]+(?:\/table\/[^/]+|\/order)?$/;

const NO_AUTH_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/signup/verify-otp",
  "/auth/signup/complete-profile",
  "/auth/forgot-password",
];

const isPathMatch = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname.startsWith(path));

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|audio/|assets/|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.mp3$|.*\\.mp4$|.*\\.webp$).*)",
    { source: "/" },
  ],
};

const middleware = async (request: NextRequest) => {
  const authCookies = await getAuthCookies();
  const pathname = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  const token = authCookies?.accessToken;
  const user = authCookies?.user;

  headers.set("x-current-path", pathname);

  if (
    request.headers.get("next-action") !== null ||
    pathname.startsWith("/api-v1")
  ) {
    return NextResponse.next();
  }

  // Proxy API requests to the backend
  if (pathname.startsWith("/api")) {
    const headersInit = await createHeaders(request.headers);
    const proxyHeaders = new Headers(headersInit);

    try {
      const response = await fetch(
        new URL(`${pathname}${request.nextUrl.search}`, API_URL),
        {
          body: request.body,
          method: request.method,
          headers: {
            Authorization: proxyHeaders.get("Authorization") ?? "",
            "Content-Type":
              proxyHeaders.get("Content-Type") ?? "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      console.error(`Proxy error for ${pathname}:`, error);
      return NextResponse.json(
        { message: "Service unavailable. Please try again later." },
        { status: 503 },
      );
    }
  }

  const isPublicRoute = isPathMatch(pathname, PUBLIC_PATHS) || USERNAME_PUBLIC_RE.test(pathname);
  const isNoAuthRoute = isPathMatch(pathname, NO_AUTH_PATHS);
  const isAuthenticated = Boolean(token && user);

  if (isPublicRoute) {
    return NextResponse.next({ headers });
  }

  if (isNoAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next({ headers });
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (user?.type !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next({ headers });
};

export default middleware;
