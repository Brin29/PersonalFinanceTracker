import { useQuery } from "@tanstack/react-query";
import { getTransactionSummary } from "@/services/transactions";
import type { TransactionPeriod } from "@/lib/types/transaction";
import { transactionKeys } from "../transaction.keys";

export function useTransactionSummary(period?: TransactionPeriod) {
  const filters = period ? { period } : undefined;

  return useQuery({
    queryKey: transactionKeys.summary(filters),
    queryFn: () => getTransactionSummary(filters),
  });
}
