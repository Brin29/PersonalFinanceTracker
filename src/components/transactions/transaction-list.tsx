"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/transactions/queries/useTransactions";
import { useDeleteTransaction } from "@/hooks/transactions/mutations/useDeleteTransaction";
import { useParamsOptions } from "@/hooks/params/useParamsOptions";
import type { TransactionFiltersState } from "@/hooks/transactions/useTransactionUrlFilters";
import { getApiErrorMessage } from "@/lib/api/errors";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { TransactionForm } from "./transaction-form";
import EditIcon from "@/components/ui/icons/editIcon";
import TrashIcon from "@/components/ui/icons/trashIcon";
import TransferIcon from "@/components/ui/icons/transferIcon";
import type {
  Transaction,
  TransactionCategory,
  TransactionFilters,
  TransactionPeriod,
  TransactionSortBy,
  TransactionType,
} from "@/lib/types/transaction";

interface TransactionListProps {
  showFilters?: boolean;
  showPagination?: boolean;
  filters: TransactionFiltersState;
  onFiltersChange: (patch: Partial<TransactionFiltersState>) => void;
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
      await remove.mutateAsync(deleting._id);
      setDeleting(null);
      setFeedback({
        tone: "success",
        title: "Transacción eliminada",
        message: "El movimiento se eliminó correctamente.",
      });
    } catch (error) {
      setDeleting(null);
      setFeedback({
        tone: "error",
        title: "No se pudo eliminar",
        message: getApiErrorMessage(
          error,
          "No se pudo eliminar la transacción.",
        ),
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

  return (
    <div className="flex flex-col gap-4">
      {showFilters ? (
        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          aria-label="Filtros"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-type" className="field-label">
              Tipo
            </label>
            <select
              id="filter-type"
              className="field-input"
              value={filters.type}
              onChange={(event) =>
                updateFilters({
                  type: event.target.value as TransactionType | "",
                })
              }
            >
              <option value="">Todos</option>
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-category" className="field-label">
              Categoría
            </label>
            <select
              id="filter-category"
              className="field-input"
              value={filters.category}
              onChange={(event) =>
                updateFilters({
                  category: event.target.value as TransactionCategory | "",
                })
              }
            >
              <option value="">Todas</option>
              {filteredCategories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-period" className="field-label">
              Período
            </label>
            <select
              id="filter-period"
              className="field-input"
              value={filters.period}
              onChange={(event) =>
                updateFilters({
                  period: event.target.value as TransactionPeriod | "",
                })
              }
            >
              <option value="">Todos los tiempos</option>
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-sort" className="field-label">
              Ordenar por
            </label>
            <select
              id="filter-sort"
              className="field-input"
              value={filters.sortBy}
              onChange={(event) =>
                updateFilters({
                  sortBy: event.target.value as TransactionSortBy,
                })
              }
            >
              <option value="date">Fecha</option>
              <option value="amount">Monto</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-order" className="field-label">
              Dirección
            </label>
            <select
              id="filter-order"
              className="field-input"
              value={filters.order}
              onChange={(event) =>
                updateFilters({ order: event.target.value as "asc" | "desc" })
              }
            >
              {filters.sortBy === "amount" ? (
                <>
                  <option value="desc">Mayor precio primero</option>
                  <option value="asc">Menor precio primero</option>
                </>
              ) : (
                <>
                  <option value="desc">Más reciente primero</option>
                  <option value="asc">Más antiguo primero</option>
                </>
              )}
            </select>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              className="btn-ghost sm:col-span-2 lg:col-span-5 lg:w-auto lg:justify-self-end lg:px-5"
              onClick={() =>
                updateFilters({ type: "", category: "", period: "" })
              }
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      ) : null}

      {isPending ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-18 mate-pulse rounded-xl border border-line bg-surface"
            />
          ))}
        </div>
      ) : data && data.transactions.length > 0 ? (
        <>
          <ul className="flex flex-col gap-3">
            {data.transactions.map((transaction) => (
              <li
                key={transaction._id}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${
                    transaction.type === "income"
                      ? "bg-leaf-500"
                      : "bg-gold-500"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {transaction.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    {categoryLabels[transaction.category] ?? transaction.category} ·{" "}
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <p
                  className={`shrink-0 font-mono text-sm font-semibold ${
                    transaction.type === "income"
                      ? "text-leaf-600"
                      : "text-gold-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(transaction)}
                    className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                    aria-label={`Editar ${transaction.title}`}
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleting(transaction);
                    }}
                    className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar ${transaction.title}`}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {showPagination && data.pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="btn-ghost w-auto px-4"
                disabled={data.pagination.page <= 1}
                onClick={() => onFiltersChange({ page: filters.page - 1 })}
              >
                Anterior
              </button>
              <span className="text-sm text-ink-soft">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <button
                type="button"
                className="btn-ghost w-auto px-4"
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() => onFiltersChange({ page: filters.page + 1 })}
              >
                Siguiente
              </button>
            </div>
          ) : null}
        </>
      ) : (
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
            <button type="button" className="btn-primary mt-1 w-auto px-6" onClick={openCreate}>
              Registrar movimiento
            </button>
          ) : (
            <button
              type="button"
              className="btn-ghost mt-1 w-auto px-6"
              onClick={() =>
                updateFilters({ type: "", category: "", period: "" })
              }
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        transaction={editing}
      />

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Eliminar transacción"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            ¿Seguro que deseas eliminar{" "}
            <span className="font-semibold text-ink">
              «{deleting?.title}»
            </span>
            ? Esta acción no se puede deshacer.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn-ghost"
              disabled={remove.isPending}
              onClick={() => setDeleting(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-danger"
              disabled={remove.isPending}
              onClick={handleDelete}
            >
              {remove.isPending ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>

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
