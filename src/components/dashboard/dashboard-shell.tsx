"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { useLayout } from "@/layouts/layout-context";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <div className="min-h-dvh">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
