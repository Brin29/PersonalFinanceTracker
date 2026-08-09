import type { TransactionFiltersState } from "@/hooks/transactions/useTransactionUrlFilters";
import type { ParamCategory, ParamOption } from "@/lib/types/params";
import type {
  TransactionCategory,
  TransactionPeriod,
  TransactionSortBy,
  TransactionType,
} from "@/lib/types/transaction";

interface TransactionFiltersBarProps {
  filters: TransactionFiltersState;
  types: ParamOption[];
  filteredCategories: ParamCategory[];
  periods: ParamOption[];
  hasActiveFilters: boolean;
  onFiltersChange: (patch: Partial<TransactionFiltersState>) => void;
}

export function TransactionFiltersBar({
  filters,
  types,
  filteredCategories,
  periods,
  hasActiveFilters,
  onFiltersChange,
}: TransactionFiltersBarProps) {
  return (
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
            onFiltersChange({
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
            onFiltersChange({
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
            onFiltersChange({
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
            onFiltersChange({
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
            onFiltersChange({ order: event.target.value as "asc" | "desc" })
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
            onFiltersChange({ type: "", category: "", period: "" })
          }
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
