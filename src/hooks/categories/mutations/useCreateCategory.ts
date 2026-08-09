import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/services/categories";
import { categoryKeys } from "../category.keys";
import { paramsKeys } from "@/hooks/params/params.keys";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: paramsKeys.all });
    },
  });
}
