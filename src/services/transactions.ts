import { apiClient } from "../lib/api/client";
import type {
  CreateTransactionResponse,
  DeleteTransactionResponse,
  TransactionFilters,
  TransactionInput,
  TransactionsResponse,
  TransactionSummaryResponse,
  UpdateTransactionResponse,
} from "../lib/types/transaction";

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<TransactionsResponse> {
  const response = await apiClient.get<TransactionsResponse>("/transactions", {
    params: filters,
  });
  return response.data;
}

export async function getTransactionSummary(
  filters: TransactionFilters = {},
): Promise<TransactionSummaryResponse> {
  const response = await apiClient.get<TransactionSummaryResponse>(
    "/transactions/summary",
    { params: filters },
  );
  return response.data;
}

export async function createTransaction(
  data: TransactionInput,
): Promise<CreateTransactionResponse> {
  const response = await apiClient.post<CreateTransactionResponse>(
    "/transactions",
    { data },
  );
  return response.data;
}

export async function updateTransaction(
  id: string,
  data: Partial<TransactionInput>,
): Promise<UpdateTransactionResponse> {
  const response = await apiClient.patch<UpdateTransactionResponse>(
    `/transactions/${id}`,
    { data },
  );
  return response.data;
}

export async function deleteTransaction(
  id: string,
): Promise<DeleteTransactionResponse> {
  const response = await apiClient.delete<DeleteTransactionResponse>(
    `/transactions/${id}`,
  );
  return response.data;
}
