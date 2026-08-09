import { apiClient } from "../lib/api/client";
import type {
  CategoriesResponse,
  CategoryInput,
  CreateCategoryResponse,
  UpdateCategoryResponse,
} from "../lib/types/category";

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await apiClient.get<CategoriesResponse>("/categories");
  return response.data;
}

export async function createCategory(
  data: CategoryInput,
): Promise<CreateCategoryResponse> {
  const response = await apiClient.post<CreateCategoryResponse>("/categories", {
    data,
  });
  return response.data;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryInput>,
): Promise<UpdateCategoryResponse> {
  const response = await apiClient.patch<UpdateCategoryResponse>(
    `/categories/${id}`,
    { data },
  );
  return response.data;
}

export async function deleteCategory(
  id: string,
): Promise<{ message: string }> {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
}
