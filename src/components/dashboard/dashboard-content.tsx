"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { useTransactionSummary } from "@/hooks/transactions/queries/useTransactionSummary";
import { useChartRangeFilter } from "@/hooks/transactions/useChartTypeFilter";
import { PERIOD_LABELS, type TransactionPeriod } from "@/lib/types/transaction";
import {
  DEFAULT_TRANSACTION_FILTERS,
  type TransactionFiltersState,
} from "@/hooks/transactions/useTransactionUrlFilters";
import { BalanceCard } from "@/components/auth/balance-card";
import { TransactionList } from "@/components/transactions/transaction-list";
import { formatCurrency } from "@/lib/utils/format";
import ArrowUpIcon from "@/components/ui/icons/arrowUpIcon";
import ArrowDownIcon from "@/components/ui/icons/arrowDownIcon";

export default function DashboardContent() {
  const { data: user } = useProfile();
  const { range } = useChartRangeFilter();
  const period: TransactionPeriod = range;
  const { data: summaryData } = useTransactionSummary(period);

  const firstName = user?.firstName ?? "";
  const summary = summaryData?.summary;

  const [recentFilters, setRecentFilters] = useState<TransactionFiltersState>({
    ...DEFAULT_TRANSACTION_FILTERS,
    limit: 5,
  });

  const updateRecentFilters = (patch: Partial<TransactionFiltersState>) => {
    setRecentFilters((current) => ({ ...current, ...patch }));
  };

  const stats = [
    {
      label: "Ingresos totales",
      amount: formatCurrency(summary?.totalIncome ?? 0),
      tone: "text-leaf-600",
      icon: ArrowUpIcon,
    },
    {
      label: "Gastos totales",
      amount: formatCurrency(summary?.totalExpenses ?? 0),
      tone: "text-gold-500",
      icon: ArrowDownIcon,
    },
    {
      label: "Balance neto",
      amount: formatCurrency(summary?.netBalance ?? 0),
      tone: (summary?.netBalance ?? 0) >= 0 ? "text-leaf-600" : "text-red-600",
      icon: ArrowUpIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Hola{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Este es el resumen de tu dinero hoy.
          </p>
        </div>
        <Link href="/movements" className="btn-primary w-auto px-5">
          + Nuevo movimiento
        </Link>
      </div>

      <BalanceCard
        summary={summary}
        byMonth={summaryData?.byMonth}
        byDay={summaryData?.byDay}
      />

      <section
        className="grid gap-3 sm:grid-cols-3"
        aria-label="Resumen de finanzas"
      >
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {stat.label}
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
                {stat.amount}
              </p>
              <p
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${stat.tone}`}
              >
                <StatIcon size={14} />
                {summary ? PERIOD_LABELS[period] : "cargando…"}
              </p>
            </div>
          );
        })}
      </section>

      <section
        className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
        aria-label="Movimientos recientes"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            Movimientos recientes
          </h3>
          <Link
            href="/movements"
            className="text-sm font-semibold text-leaf-600 transition-colors hover:text-leaf-700"
          >
            Ver todos
          </Link>
        </div>

        <div className="mt-5">
          <TransactionList
            showFilters={false}
            showPagination={false}
            filters={recentFilters}
            onFiltersChange={updateRecentFilters}
          />
        </div>
      </section>
    </div>
  );
}
