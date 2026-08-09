"use client";

import { Suspense, useState } from "react";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { useTransactionUrlFilters } from "@/hooks/transactions/useTransactionUrlFilters";

function MovementsContent() {
  const { filters, updateFilters } = useTransactionUrlFilters(10);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Movimientos
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Registra y consulta todos tus ingresos y gastos.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary w-auto px-5"
          onClick={() => setFormOpen(true)}
        >
          + Nueva transacción
        </button>
      </div>

      <TransactionList filters={filters} onFiltersChange={updateFilters} />

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

export default function MovementsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />
      }
    >
      <MovementsContent />
    </Suspense>
  );
}
