"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/auth/mutations/useLogout";
import { useRouter } from "next/navigation";
import CloseIcon from "@/components/ui/icons/closeIcon";
import LogoutIcon from "@/components/ui/icons/logoutIcon";
import { UserAvatar } from "./user-avatar";
import {
  NAV_ITEMS,
  ACCOUNT_NAV_ITEMS,
  isNavActive,
  type NavItem,
} from "./nav";
import { useProfile } from "@/hooks/profile/queries/useProfile";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-leaf-500 font-mono text-xs font-bold text-ink">
        F
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-paper dark:text-ink">
        Finance
      </span>
    </Link>
  );
}

function NavLink({ item, pathname, onClose }: {
  item: NavItem;
  pathname: string | null;
  onClose: () => void;
}) {
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-leaf-500 text-ink" : "text-paper/70 hover:bg-white/5 hover:text-paper dark:text-ink/70 dark:hover:text-ink"}`}
    >
      <Icon size={18} />
      {item.label}
    </Link>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useProfile();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity dark:bg-black/60 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink px-4 py-5 text-paper transition-transform duration-200 dark:bg-[#18221d] dark:text-ink lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between px-1">
          <Brand />
          <button
            type="button"
            className="rounded-lg p-1.5 text-paper/60 transition-colors hover:bg-white/5 hover:text-paper dark:text-ink/60 dark:hover:text-ink lg:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto">
          <div>
            <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-paper/40 dark:text-ink/40">
              Menú
            </p>
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-paper/40 dark:text-ink/40">
              Cuenta
            </p>
            <div className="flex flex-col gap-1">
              {ACCOUNT_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "Cargando…"}
            </p>
            <p className="truncate text-xs text-paper/50 dark:text-ink/50">
              {user?.email ?? "…"}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-paper/50 transition-colors hover:bg-white/5 hover:text-paper dark:text-ink/50 dark:hover:text-ink"
            onClick={handleLogout}
            disabled={logout.isPending}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogoutIcon size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
