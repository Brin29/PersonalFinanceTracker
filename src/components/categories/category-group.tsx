import { type RefObject } from "react";
import type { Category, CategoryType } from "@/lib/types/category";
import { CategoryRow } from "./category-row";
import { CategoryGroupEmpty } from "./category-group-empty";

interface CategoryGroupProps {
  type: CategoryType;
  title: string;
  description: string;
  categories: Category[];
  isEditing: (category: Category) => boolean;
  editValue: string;
  isUpdatePending: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onEditValueChange: (value: string) => void;
  onFinishEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onStartEdit: (category: Category) => void;
  onRequestDelete: (category: Category) => void;
}

export function CategoryGroup({
  type,
  title,
  description,
  categories,
  isEditing,
  editValue,
  isUpdatePending,
  inputRef,
  onEditValueChange,
  onFinishEdit,
  onCancelEdit,
  onStartEdit,
  onRequestDelete,
}: CategoryGroupProps) {
  const groupCategories = categories.filter((category) => category.type === type);
  const userCategories = groupCategories.filter((category) => !category.isSystem);
  const systemCategories = groupCategories.filter((category) => category.isSystem);

  return groupCategories.length === 0 ? (
    <CategoryGroupEmpty title={title} />
  ) : (
    <section aria-label={title}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight text-ink">
          {title}
        </h3>
        <p className="text-xs text-ink-soft">{description}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {userCategories.map((category) => (
          <CategoryRow
            key={category._id}
            category={category}
            isEditing={isEditing(category)}
            editValue={editValue}
            isUpdatePending={isUpdatePending}
            inputRef={inputRef}
            onEditValueChange={onEditValueChange}
            onFinishEdit={() => onFinishEdit(category)}
            onCancelEdit={onCancelEdit}
            onStartEdit={() => onStartEdit(category)}
            onRequestDelete={() => onRequestDelete(category)}
          />
        ))}
        {systemCategories.map((category) => (
          <CategoryRow
            key={category._id}
            category={category}
            isEditing={isEditing(category)}
            editValue={editValue}
            isUpdatePending={isUpdatePending}
            inputRef={inputRef}
            onEditValueChange={onEditValueChange}
            onFinishEdit={() => onFinishEdit(category)}
            onCancelEdit={onCancelEdit}
            onStartEdit={() => onStartEdit(category)}
            onRequestDelete={() => onRequestDelete(category)}
          />
        ))}
      </ul>
    </section>
  );
}
