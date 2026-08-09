"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthRoute, isPrivateRoute } from "./routes";

export function AppFooter() {
  const pathname = usePathname();

  if (isAuthRoute(pathname) || isPrivateRoute(pathname)) return null;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <p className="text-xs text-ink-soft">
          © {new Date().getFullYear()} Finance · Finanzas personales
        </p>
        <nav className="flex gap-4" aria-label="Enlaces">
          <Link
            href="/login"
            className="text-xs font-semibold text-ink-soft transition-colors hover:text-leaf-600"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold text-ink-soft transition-colors hover:text-leaf-600"
          >
            Registro
          </Link>
        </nav>
      </div>
    </footer>
  );
}
