import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/services/transactions";
import { transactionKeys } from "../transaction.keys";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
