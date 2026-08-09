import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transactions";
import { transactionKeys } from "../transaction.keys";
import type { TransactionFilters } from "@/lib/types/transaction";

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => getTransactions(filters),
  });
}
