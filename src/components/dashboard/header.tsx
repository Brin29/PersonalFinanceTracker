"use client";

import { usePathname } from "next/navigation";
import MenuIcon from "@/components/ui/icons/menuIcon";
import { getPageTitle } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  onMenuOpen: () => void;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function Header({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-ink transition-colors hover:bg-ink/5 lg:hidden"
            onClick={onMenuOpen}
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
