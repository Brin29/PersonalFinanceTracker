import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/services/categories";
import { categoryKeys } from "../category.keys";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
