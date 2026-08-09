import { CATEGORY_TYPE_LABELS, type CategoryType } from "@/lib/types/category";

interface CategoryCreateFormProps {
  newName: string;
  newType: CategoryType;
  isPending: boolean;
  onNameChange: (value: string) => void;
  onTypeChange: (value: CategoryType) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function CategoryCreateForm({
  newName,
  newType,
  isPending,
  onNameChange,
  onTypeChange,
  onSubmit,
}: CategoryCreateFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-end sm:gap-3"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-category-type" className="field-label">
          Tipo
        </label>
        <select
          id="new-category-type"
          value={newType}
          onChange={(event) => onTypeChange(event.target.value as CategoryType)}
          className="field-input"
        >
          <option value="expense">{CATEGORY_TYPE_LABELS.expense}</option>
          <option value="income">{CATEGORY_TYPE_LABELS.income}</option>
        </select>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label htmlFor="new-category-name" className="field-label">
          Nombre
        </label>
        <input
          id="new-category-name"
          value={newName}
          onChange={(event) => onNameChange(event.target.value)}
          maxLength={50}
          placeholder="Nombre de la nueva categoría"
          className="field-input"
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-auto sm:px-5"
        disabled={!newName.trim() || isPending}
      >
        {isPending ? "Creando…" : "+ Agregar categoría"}
      </button>
    </form>
  );
}
