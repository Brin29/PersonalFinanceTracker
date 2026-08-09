const AUTH_ROUTES = ["/login", "/register", "/magic-login", "/oauth-success"];

const PRIVATE_PREFIXES = [
  "/dashboard",
  "/movements",
  "/categories",
  "/settings",
];

export function isAuthRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isPrivateRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return PRIVATE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
