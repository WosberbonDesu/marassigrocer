import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes: auth guard
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // API routes: pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // All public routes: next-intl locale handling
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\..*).*)"],
};
