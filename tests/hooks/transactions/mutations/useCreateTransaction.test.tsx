import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCreateTransaction } from "@/hooks/transactions/mutations/useCreateTransaction";
import { useTransactions } from "@/hooks/transactions/queries/useTransactions";
import { createTestWrapper } from "@test/test-utils";
import type { Transaction } from "@/lib/types/transaction";

const mocks = vi.hoisted(() => ({
  createTransaction: vi.fn(),
  getTransactions: vi.fn(),
}));

vi.mock("@/services/transactions", () => ({
  createTransaction: mocks.createTransaction,
  getTransactions: mocks.getTransactions,
}));

const mockTransaction: Transaction = {
  _id: "t1",
  title: "Salario",
  amount: 15000,
  type: "income",
  category: "salary",
  date: "2026-08-01",
  createdAt: "2026-08-01",
  updatedAt: "2026-08-01",
};

const input = {
  title: "Salario",
  amount: 15000,
  type: "income" as const,
  category: "salary" as const,
};

describe("useCreateTransaction", () => {
  it("llama al servicio con el payload", async () => {
    mocks.createTransaction.mockResolvedValueOnce({
      message: "ok",
      transaction: mockTransaction,
    });

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(input);
    });

    expect(mocks.createTransaction).toHaveBeenCalledWith(
      input,
      expect.anything(),
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("invalida las queries de transacciones tras crear", async () => {
    mocks.getTransactions.mockResolvedValue({
      transactions: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    mocks.createTransaction.mockResolvedValueOnce({
      message: "ok",
      transaction: mockTransaction,
    });

    const wrapper = createTestWrapper();
    const { result } = renderHook(
      () => {
        const transactions = useTransactions();
        const create = useCreateTransaction();
        return { transactions, create };
      },
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.transactions.isSuccess).toBe(true);
    });
    expect(mocks.getTransactions).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.create.mutateAsync(input);
    });

    await waitFor(() => {
      expect(mocks.getTransactions).toHaveBeenCalledTimes(2);
    });
  });

  it("propaga el error si la creación falla", async () => {
    mocks.createTransaction.mockRejectedValueOnce(new Error("categoría inválida"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(input)).rejects.toThrow(
        "categoría inválida",
      );
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
