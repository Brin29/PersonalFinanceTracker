const BLOCKED_PREFIXES = ["/login", "/register", "/oauth-success"];

export function resolvePostAuthPath(
  from: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!from) return fallback;
  if (!from.startsWith("/")) return fallback;
  if (from.startsWith("//") || from.startsWith("/\\") || from.includes("\\"))
    return fallback;
  if (BLOCKED_PREFIXES.some((prefix) => from.startsWith(prefix)))
    return fallback;
  return from;
}
