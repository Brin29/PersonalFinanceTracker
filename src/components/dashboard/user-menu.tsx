"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROVIDER_LABELS } from "@/lib/utils/provider";
import ChevronDownIcon from "@/components/ui/icons/chevronDownIcon";
import SettingsIcon from "@/components/ui/icons/settingsIcon";
import LogoutIcon from "@/components/ui/icons/logoutIcon";
import { UserAvatar } from "./user-avatar";
import { ProfileModal } from "./profile-modal";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { useLogout } from "@/hooks/auth/mutations/useLogout";

export function UserMenu() {
  const router = useRouter();
  const { data: user } = useProfile();
  const logout = useLogout();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  const provider = user?.provider ? PROVIDER_LABELS[user.provider] : undefined;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menú de usuario"
        onClick={() => setOpen((value) => !value)}
      >
        <UserAvatar user={user} size="sm" />
        <ChevronDownIcon
          className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-ink/10"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {user
                  ? `${user.firstName} ${user.lastName}`
                  : "Cargando…"}
              </p>
              <p className="truncate text-xs text-ink-soft">
                {user?.email ?? "…"}
              </p>
            </div>
          </div>

          {provider ? (
            <p className="px-3 pb-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-leaf-700">
                <span className="size-1 rounded-full bg-leaf-600" />
                {provider}
              </span>
            </p>
          ) : null}

          <div className="my-1.5 h-px bg-line" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            onClick={() => {
              setOpen(false);
              setProfileOpen(true);
            }}
          >
            <SettingsIcon size={16} className="text-ink-soft" />
            Mi perfil
          </button>

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogoutIcon size={16} className="text-ink-soft" />
            {logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      ) : null}

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
