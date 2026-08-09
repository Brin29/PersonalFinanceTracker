"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ACCOUNT_NAV_ITEMS, isNavActive } from "./nav";

export function MobileNav() {
  const pathname = usePathname();
  const items = [...NAV_ITEMS, ...ACCOUNT_NAV_ITEMS];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium"
            >
              <span className={active ? "text-leaf-600" : "text-ink-soft"}>
                <Icon size={18} />
              </span>
              <span
                className={`${active ? "text-leaf-600" : "text-ink-soft"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
