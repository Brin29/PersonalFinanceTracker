import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Transaction } from "@/lib/types/transaction";
import EditIcon from "@/components/ui/icons/editIcon";
import TrashIcon from "@/components/ui/icons/trashIcon";

interface TransactionRowProps {
  transaction: Transaction;
  categoryLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function TransactionRow({
  transaction,
  categoryLabel,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const isIncome = transaction.type === "income";

  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span
        className={`size-2 shrink-0 rounded-full ${
          isIncome ? "bg-leaf-500" : "bg-gold-500"
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {transaction.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-soft">
          {categoryLabel} · {formatDate(transaction.date)}
        </p>
      </div>
      <p
        className={`shrink-0 font-mono text-sm font-semibold ${
          isIncome ? "text-leaf-600" : "text-gold-500"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={`Editar ${transaction.title}`}
        >
          <EditIcon size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${transaction.title}`}
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  );
}
