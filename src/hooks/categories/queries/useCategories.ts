import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";
import { categoryKeys } from "../category.keys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });
}
