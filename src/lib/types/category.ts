export const CATEGORY_TYPES = ["income", "expense"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: "Ingreso",
  expense: "Gasto",
};

export interface Category {
  _id: string;
  name: string;
  key: string;
  type: CategoryType;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryInput {
  name: string;
  type: CategoryType;
}

export interface CreateCategoryResponse {
  message: string;
  category: Category;
}

export interface UpdateCategoryResponse {
  message: string;
  category: Category;
}
