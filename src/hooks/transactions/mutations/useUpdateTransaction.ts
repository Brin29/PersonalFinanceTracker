import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/services/transactions";
import { transactionKeys } from "../transaction.keys";
import type { TransactionInput } from "@/lib/types/transaction";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TransactionInput>;
    }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
