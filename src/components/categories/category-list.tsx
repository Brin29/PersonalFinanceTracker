"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useCategories } from "@/hooks/categories/queries/useCategories";
import { useCreateCategory } from "@/hooks/categories/mutations/useCreateCategory";
import { useUpdateCategory } from "@/hooks/categories/mutations/useUpdateCategory";
import { useDeleteCategory } from "@/hooks/categories/mutations/useDeleteCategory";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { Category, CategoryType } from "@/lib/types/category";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { CategoryCreateForm } from "./category-create-form";
import { CategoryGroup } from "./category-group";
import { CategoryListSkeleton } from "./category-list-skeleton";
import { CategoryEmptyState } from "./category-empty-state";
import { CategoryDeleteModal } from "./category-delete-modal";

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

  const isEditingCategory = (category: Category) => editingId === category._id;

  return (
    <div className="flex flex-col gap-6">
      <CategoryCreateForm
        newName={newName}
        newType={newType}
        isPending={create.isPending}
        onNameChange={setNewName}
        onTypeChange={setNewType}
        onSubmit={handleCreate}
      />

      {isPending ? (
        <CategoryListSkeleton />
      ) : categories.length > 0 ? (
        <div className="flex flex-col gap-8">
          {CATEGORY_GROUPS.map((group) => (
            <CategoryGroup
              key={group.type}
              type={group.type}
              title={group.title}
              description={group.description}
              categories={categories}
              isEditing={isEditingCategory}
              editValue={editValue}
              isUpdatePending={update.isPending}
              inputRef={editInputRef}
              onEditValueChange={setEditValue}
              onFinishEdit={finishEdit}
              onCancelEdit={cancelEdit}
              onStartEdit={startEdit}
              onRequestDelete={setDeleting}
            />
          ))}
        </div>
      ) : (
        <CategoryEmptyState />
      )}

      <CategoryDeleteModal
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
