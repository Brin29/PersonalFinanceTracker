import type { ReactNode } from "react";
import { BalanceCard } from "./balance-card";

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-leaf-600 font-mono text-xs font-bold text-white">
        L
      </span>
      <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-ink">
        Ledger
      </span>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper lg:flex-row">
      <aside className="hidden flex-col justify-between gap-12 p-12 lg:flex lg:w-[44%] xl:p-16">
        <Brand />
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
            Tu dinero,
            <br />
            <span className="text-leaf-600">siempre al día.</span>
          </h1>
          <BalanceCard />
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Registra tus ingresos y gastos, y toma el control de tus finanzas
          desde un solo lugar.
        </p>
      </aside>

      <main className="flex flex-1 flex-col gap-8 p-5 sm:p-10 lg:items-center lg:justify-center lg:p-12">
        <div className="flex w-full max-w-sm flex-col gap-6 lg:hidden">
          <Brand />
          <BalanceCard compact />
        </div>
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
