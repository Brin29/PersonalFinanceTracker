import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Validar que el usuario este autenticado
  // auth_session la setea el frontend en su propio dominio (backend esta en otro dominio)
  const hasSession =
    request.cookies.has("auth_session")

  const pathname = request.nextUrl.pathname;
  
  const isAuthRoute =
  pathname.startsWith("/login") ||
  pathname.startsWith("/register");
  
  const isProtectedRoute =
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/movements") ||
  pathname.startsWith("/categories") ||
  pathname.startsWith("/profile") ||
  pathname.startsWith("/settings");
  
  if (!hasSession && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    const destination = pathname + request.nextUrl.search;
    if (destination !== "/") {
      loginUrl.searchParams.set("from", destination);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/movements/:path*",
    "/categories/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
