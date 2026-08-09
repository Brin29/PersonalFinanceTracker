"use client";

import { type RefObject } from "react";
import type { Category } from "@/lib/types/category";
import TrashIcon from "@/components/ui/icons/trashIcon";

interface CategoryRowProps {
  category: Category;
  isEditing: boolean;
  editValue: string;
  isUpdatePending: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onEditValueChange: (value: string) => void;
  onFinishEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onRequestDelete: () => void;
}

export function CategoryRow({
  category,
  isEditing,
  editValue,
  isUpdatePending,
  inputRef,
  onEditValueChange,
  onFinishEdit,
  onCancelEdit,
  onStartEdit,
  onRequestDelete,
}: CategoryRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <span
        className={`size-2 shrink-0 rounded-full ${
          category.type === "income" ? "bg-leaf-500" : "bg-gold-500"
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(event) => onEditValueChange(event.target.value)}
            onBlur={onFinishEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") onCancelEdit();
            }}
            maxLength={50}
            className="field-input w-full"
            aria-label={`Nombre de la categoría ${category.name}`}
          />
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            disabled={isUpdatePending}
            className="block max-w-full truncate text-left text-sm font-semibold text-ink transition-colors hover:text-leaf-600 disabled:cursor-default disabled:hover:text-ink"
            title="Haz clic para editar"
          >
            {category.name}
          </button>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onStartEdit}
          disabled={isUpdatePending}
          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={`Editar ${category.name}`}
        >
          <span className="text-xs font-semibold">Editar</span>
        </button>
        <button
          type="button"
          onClick={onRequestDelete}
          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${category.name}`}
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  );
}
