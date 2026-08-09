"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/transactions/queries/useTransactions";
import { useDeleteTransaction } from "@/hooks/transactions/mutations/useDeleteTransaction";
import { useParamsOptions } from "@/hooks/params/useParamsOptions";
import type { TransactionFiltersState } from "@/hooks/transactions/useTransactionUrlFilters";
import { getMutationErrorMessage } from "@/lib/api/error-message";
import { getMutationSuccessMessage } from "@/lib/api/success-message";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { TransactionForm } from "./transaction-form";
import { TransactionFiltersBar } from "./transaction-filters";
import { TransactionRow } from "./transaction-row";
import TransferIcon from "@/components/ui/icons/transferIcon";
import type {
  Transaction,
  TransactionFilters,
  TransactionPagination,
} from "@/lib/types/transaction";

interface TransactionListProps {
  showFilters?: boolean;
  showPagination?: boolean;
  filters: TransactionFiltersState;
  onFiltersChange: (patch: Partial<TransactionFiltersState>) => void;
}

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button type="button" className="btn-ghost w-auto px-4" disabled={page <= 1} onClick={onPrev}>
        Anterior
      </button>
      <span className="text-sm text-ink-soft">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        className="btn-ghost w-auto px-4"
        disabled={page >= totalPages}
        onClick={onNext}
      >
        Siguiente
      </button>
    </div>
  );
}

function TransactionListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="h-18 mate-pulse rounded-xl border border-line bg-surface"
        />
      ))}
    </div>
  );
}

interface TransactionEmptyStateProps {
  hasActiveFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

function TransactionEmptyState({
  hasActiveFilters,
  onCreate,
  onClearFilters,
}: TransactionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
        <TransferIcon size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">
          {hasActiveFilters
            ? "Sin resultados con estos filtros"
            : "Aún no tienes movimientos"}
        </p>
        <p className="mt-0.5 text-sm text-ink-soft">
          {hasActiveFilters
            ? "Prueba con otros filtros o limpia la búsqueda."
            : "Registra tu primer ingreso o gasto para empezar a llevar tu dinero al día."}
        </p>
      </div>
      {!hasActiveFilters ? (
        <button type="button" className="btn-primary mt-1 w-auto px-6" onClick={onCreate}>
          Registrar movimiento
        </button>
      ) : (
        <button type="button" className="btn-ghost mt-1 w-auto px-6" onClick={onClearFilters}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

interface TransactionDeleteModalProps {
  deleting: Transaction | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function TransactionDeleteModal({
  deleting,
  isPending,
  onCancel,
  onConfirm,
}: TransactionDeleteModalProps) {
  return (
    <Modal open={deleting !== null} onClose={onCancel} title="Eliminar transacción">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-soft">
          ¿Seguro que deseas eliminar{" "}
          <span className="font-semibold text-ink">«{deleting?.title}»</span>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn-ghost" disabled={isPending} onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-danger"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function TransactionList({
  showFilters = true,
  showPagination = true,
  filters,
  onFiltersChange,
}: TransactionListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);
  const remove = useDeleteTransaction();
  const { types, categories, periods, categoryLabels } = useParamsOptions();

  const filteredCategories = useMemo(
    () =>
      filters.type
        ? categories.filter((category) => category.type === filters.type)
        : categories,
    [categories, filters.type],
  );

  const queryFilters: TransactionFilters = useMemo(() => {
    const result: TransactionFilters = {
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,
      limit: filters.limit,
    };
    if (filters.type) result.type = filters.type;
    if (filters.category) result.category = filters.category;
    if (filters.period) result.period = filters.period;
    return result;
  }, [filters]);

  const { data, isPending } = useTransactions(queryFilters);

  const updateFilters = (patch: Partial<TransactionFiltersState>) => {
    onFiltersChange(patch);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const result = await remove.mutateAsync(deleting._id);
      setDeleting(null);
      setFeedback({
        tone: "success",
        title: "Transacción eliminada",
        message: getMutationSuccessMessage(result.code),
      });
    } catch (error) {
      setDeleting(null);
      setFeedback({
        tone: "error",
        title: "No se pudo eliminar",
        message: getMutationErrorMessage(error.code),
      });
    }
  };

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    action?.();
  };

  const hasActiveFilters =
    filters.type !== "" || filters.category !== "" || filters.period !== "";

  const pagination: TransactionPagination | undefined = data?.pagination;

  return (
    <div className="flex flex-col gap-4">
      {showFilters ? (
        <TransactionFiltersBar
          filters={filters}
          types={types}
          filteredCategories={filteredCategories}
          periods={periods}
          hasActiveFilters={hasActiveFilters}
          onFiltersChange={updateFilters}
        />
      ) : null}

      {isPending ? (
        <TransactionListSkeleton />
      ) : data && data.transactions.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {data.transactions.map((transaction) => (
              <TransactionRow
                key={transaction._id}
                transaction={transaction}
                categoryLabel={
                  categoryLabels[transaction.category] ?? transaction.category
                }
                onEdit={() => openEdit(transaction)}
                onDelete={() => setDeleting(transaction)}
              />
            ))}
          </ul>

          {showPagination && pagination && pagination.totalPages > 1 ? (
            <PaginationControls
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPrev={() => onFiltersChange({ page: filters.page - 1 })}
              onNext={() => onFiltersChange({ page: filters.page + 1 })}
            />
          ) : null}
        </>
      ) : (
        <TransactionEmptyState
          hasActiveFilters={hasActiveFilters}
          onCreate={openCreate}
          onClearFilters={() =>
            updateFilters({ type: "", category: "", period: "" })
          }
        />
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        transaction={editing}
      />

      <TransactionDeleteModal
        deleting={deleting}
        isPending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />

      {feedback ? (
        <InfoModal
          open={true}
          feedback={feedback}
          onAccept={handleAcceptFeedback}
        />
      ) : null}
    </div>
  );
}
