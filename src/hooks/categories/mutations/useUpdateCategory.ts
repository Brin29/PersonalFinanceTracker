import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/services/categories";
import { categoryKeys } from "../category.keys";
import type { CategoryInput } from "@/lib/types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CategoryInput>;
    }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
