"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuIcon from "@/components/ui/icons/menuIcon";
import { getPageTitle } from "@/components/dashboard/nav";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { useLayout } from "./layout-context";
import { isAuthRoute, isPrivateRoute } from "./routes";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function Brand({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-leaf-600 font-mono text-xs font-bold text-white">
        F
      </span>
      <span
        className={`font-mono text-sm font-semibold uppercase tracking-[0.25em] transition-colors ${
          onDark ? "text-paper" : "text-ink"
        }`}
      >
        Finance
      </span>
    </Link>
  );
}

function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,border-color] ${
        scrolled
          ? "bg-paper/85 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)] backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Brand onDark={onDark} />
        <div className="flex items-center gap-1">
          <ThemeToggle onDark={onDark} />
          <Link href="/login" className="btn-primary sm:w-auto sm:px-7">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  );
}

function PrivateHeader() {
  const pathname = usePathname();
  const { openSidebar } = useLayout();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur lg:pl-64">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-ink transition-colors hover:bg-ink/5 lg:hidden"
            onClick={openSidebar}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              {DATE_FORMATTER.format(new Date())}
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-ink">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function AppHeader() {
  const pathname = usePathname();

  if (isAuthRoute(pathname)) return null;
  if (isPrivateRoute(pathname)) return <PrivateHeader />;
  return <PublicHeader />;
}
