import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTransactions } from "@/hooks/transactions/queries/useTransactions";
import { createTestWrapper } from "@test/test-utils";
import type { TransactionsResponse } from "@/lib/types/transaction";

const mocks = vi.hoisted(() => ({
  getTransactions: vi.fn(),
}));

vi.mock("@/services/transactions", () => ({
  getTransactions: mocks.getTransactions,
}));

const response: TransactionsResponse = {
  transactions: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

describe("useTransactions", () => {
  it("solicita las transacciones con los filtros", async () => {
    mocks.getTransactions.mockResolvedValueOnce(response);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useTransactions({ limit: 10 }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mocks.getTransactions).toHaveBeenCalledWith({ limit: 10 });
    expect(result.current.data).toEqual(response);
  });

  it("crea una nueva query al cambiar los filtros", async () => {
    mocks.getTransactions.mockResolvedValue(response);

    const wrapper = createTestWrapper();
    const { result, rerender } = renderHook(
      ({ filters }: { filters?: { limit?: number } }) =>
        useTransactions(filters),
      { wrapper, initialProps: { filters: { limit: 5 } } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ filters: { limit: 20 } });

    await waitFor(() => {
      expect(mocks.getTransactions).toHaveBeenCalledTimes(2);
    });

    expect(mocks.getTransactions).toHaveBeenLastCalledWith({ limit: 20 });
  });

  it("propaga el error de la API", async () => {
    mocks.getTransactions.mockRejectedValueOnce(new Error("sin sesión"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe("useTransactions con act", () => {
  it("mantiene los datos en caché entre renders", async () => {
    mocks.getTransactions.mockResolvedValue(response);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.refetch();
    });

    expect(mocks.getTransactions).toHaveBeenCalledTimes(2);
  });
});
