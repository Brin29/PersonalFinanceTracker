"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useCategories } from "@/hooks/categories/queries/useCategories";
import { useCreateCategory } from "@/hooks/categories/mutations/useCreateCategory";
import { useUpdateCategory } from "@/hooks/categories/mutations/useUpdateCategory";
import { useDeleteCategory } from "@/hooks/categories/mutations/useDeleteCategory";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { Category, CategoryType } from "@/lib/types/category";
import { CATEGORY_TYPE_LABELS } from "@/lib/types/category";
import { Modal } from "@/components/ui/modal";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import TrashIcon from "@/components/ui/icons/trashIcon";
import TagIcon from "@/components/ui/icons/tagIcon";

type CategoryGroup = {
  type: CategoryType;
  title: string;
  description: string;
};

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    type: "income",
    title: "Ingresos",
    description: "Dinero que entra",
  },
  {
    type: "expense",
    title: "Gastos",
    description: "Dinero que sale",
  },
];

export function CategoryList() {
  const { data, isPending } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CategoryType>("expense");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      const input = editInputRef.current;
      input?.focus();
      input?.select();
    }
  }, [editingId]);

  const categories = (data?.categories ?? []).map((category) => ({
    ...category,
    type: (category.type ?? "expense") as CategoryType,
  }));

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setEditValue(category.name);
  };

  const finishEdit = async (category: Category) => {
    if (editingId !== category._id) return;
    setEditingId(null);
    const trimmed = editValue.trim();
    if (trimmed === category.name || trimmed === "") return;
    try {
      await update.mutateAsync({ id: category._id, data: { name: trimmed } });
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo actualizar",
        message: getApiErrorMessage(
          error,
          "No se pudo actualizar la categoría.",
        ),
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed || create.isPending) return;
    try {
      await create.mutateAsync({ name: trimmed, type: newType });
      setNewName("");
    } catch (error) {
      setFeedback({
        tone: "error",
        title: "No se pudo crear",
        message: getApiErrorMessage(error, "No se pudo crear la categoría."),
      });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      setDeleting(null);
      setFeedback({
        tone: "success",
        title: "Categoría eliminada",
        message: "La categoría se eliminó correctamente.",
      });
    } catch (error) {
      setDeleting(null);
      setFeedback({
        tone: "error",
        title: "No se pudo eliminar",
        message: getApiErrorMessage(error, "No se pudo eliminar la categoría."),
      });
    }
  };

  const handleAcceptFeedback = () => {
    const action = feedback?.onAccept;
    setFeedback(null);
    action?.();
  };

  const renderCategoryRow = (category: Category) => {
    const isEditing = editingId === category._id;

    return (
      <li
        key={category._id}
        className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
      >
        <span
          className={`size-2 shrink-0 rounded-full ${
            category.type === "income" ? "bg-leaf-500" : "bg-gold-500"
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              ref={editInputRef}
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              onBlur={() => finishEdit(category)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") cancelEdit();
              }}
              maxLength={50}
              className="field-input w-full"
              aria-label={`Nombre de la categoría ${category.name}`}
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit(category)}
              disabled={update.isPending}
              className="block max-w-full truncate text-left text-sm font-semibold text-ink transition-colors hover:text-leaf-600 disabled:cursor-default disabled:hover:text-ink"
              title="Haz clic para editar"
            >
              {category.name}
            </button>
          )}
          <p className="mt-0.5 truncate text-xs text-ink-soft">
            {category.key}
          </p>
        </div>
        {category.isSystem ? (
          <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink-soft">
            Sistema
          </span>
        ) : null}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => startEdit(category)}
            disabled={update.isPending}
            className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label={`Editar ${category.name}`}
          >
            <span className="text-xs font-semibold">Editar</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleting(category)}
            className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Eliminar ${category.name}`}
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </li>
    );
  };

  const renderGroup = ({ type, title, description }: CategoryGroup) => {
    const groupCategories = categories.filter(
      (category) => category.type === type,
    );
    const userCategories = groupCategories.filter(
      (category) => !category.isSystem,
    );
    const systemCategories = groupCategories.filter(
      (category) => category.isSystem,
    );

    if (groupCategories.length === 0) {
      return (
        <section
          key={type}
          aria-label={title}
          className="flex flex-col gap-3 rounded-xl border border-dashed border-line px-6 py-8 text-center"
        >
          <div>
            <p className="text-sm font-semibold text-ink">{title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Aún no hay categorías de {title.toLowerCase()}.
            </p>
          </div>
        </section>
      );
    }

    return (
      <section key={type} aria-label={title}>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            {title}
          </h3>
          <p className="text-xs text-ink-soft">{description}</p>
        </div>
        <ul className="flex flex-col gap-3">
          {userCategories.map(renderCategoryRow)}
          {systemCategories.map(renderCategoryRow)}
        </ul>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-end sm:gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-category-type" className="field-label">
            Tipo
          </label>
          <select
            id="new-category-type"
            value={newType}
            onChange={(event) =>
              setNewType(event.target.value as CategoryType)
            }
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
            onChange={(event) => setNewName(event.target.value)}
            maxLength={50}
            placeholder="Nombre de la nueva categoría"
            className="field-input"
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-auto sm:px-5"
          disabled={!newName.trim() || create.isPending}
        >
          {create.isPending ? "Creando…" : "+ Agregar categoría"}
        </button>
      </form>

      {isPending ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl border border-line bg-surface"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="flex flex-col gap-8">
          {CATEGORY_GROUPS.map(renderGroup)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-12 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <TagIcon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              Aún no hay categorías
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Crea tu primera categoría para organizar mejor tus movimientos.
            </p>
          </div>
        </div>
      )}

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Eliminar categoría"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            ¿Seguro que deseas eliminar{" "}
            <span className="font-semibold text-ink">«{deleting?.name}»</span>?
            {deleting?.isSystem
              ? " Solo se ocultará para ti; los demás usuarios seguirán viendo la categoría del sistema."
              : " Esta acción no se puede deshacer."}
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
