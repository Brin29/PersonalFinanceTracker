import type { TransactionFilters } from "@/lib/types/transaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: TransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  summary: (filters?: TransactionFilters) =>
    filters
      ? ([...transactionKeys.all, "summary", filters] as const)
      : ([...transactionKeys.all, "summary"] as const),
};
