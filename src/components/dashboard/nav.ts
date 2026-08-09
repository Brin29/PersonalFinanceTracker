import type { ComponentType } from "react";
import DashboardIcon from "@/components/ui/icons/dashboardIcon";
import TransferIcon from "@/components/ui/icons/transferIcon";
import TagIcon from "@/components/ui/icons/tagIcon";
import SettingsIcon from "@/components/ui/icons/settingsIcon";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Resumen", icon: DashboardIcon },
  { href: "/movements", label: "Movimientos", icon: TransferIcon },
  { href: "/categories", label: "Categorías", icon: TagIcon },
];

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { href: "/settings", label: "Configuración", icon: SettingsIcon },
];

export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname.startsWith(href);
}

export function getPageTitle(pathname: string | null): string {
  const item = [...NAV_ITEMS, ...ACCOUNT_NAV_ITEMS].find((item) =>
    isNavActive(pathname, item.href),
  );
  return item?.label ?? "Ledger";
}
