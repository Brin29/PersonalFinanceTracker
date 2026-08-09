import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import type { Transaction, TransactionInput } from "@/lib/types/transaction";
import {
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactions,
  updateTransaction,
} from "@/services/transactions";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);
const mockedPatch = vi.mocked(apiClient.patch);
const mockedDelete = vi.mocked(apiClient.delete);

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

function mockResponse<T>(data: T) {
  return { data, status: 200, statusText: "OK", headers: {}, config: {} };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("transactions service", () => {
  it("getTransactions envía los filtros como query params", async () => {
    mockedGet.mockResolvedValueOnce(
      mockResponse({ transactions: [mockTransaction], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } }),
    );

    const filters = { type: "income" as const, limit: 10 };
    const result = await getTransactions(filters);

    expect(mockedGet).toHaveBeenCalledWith("/transactions", { params: filters });
    expect(result.transactions).toHaveLength(1);
  });

  it("getTransactions funciona sin filtros", async () => {
    mockedGet.mockResolvedValueOnce(mockResponse({ transactions: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }));

    await getTransactions();

    expect(mockedGet).toHaveBeenCalledWith("/transactions", { params: {} });
  });

  it("getTransactionSummary llama a /transactions/summary", async () => {
    mockedGet.mockResolvedValueOnce(
      mockResponse({
        summary: { totalIncome: 100, totalExpenses: 50, netBalance: 50, totalTransactions: 2 },
        byMonth: [],
        byDay: [],
      }),
    );

    const result = await getTransactionSummary({ period: "30d" });

    expect(mockedGet).toHaveBeenCalledWith("/transactions/summary", {
      params: { period: "30d" },
    });
    expect(result.summary.netBalance).toBe(50);
  });

  it("createTransaction envía el payload a /transactions", async () => {
    mockedPost.mockResolvedValueOnce(
      mockResponse({ message: "ok", transaction: mockTransaction }),
    );

    const input: TransactionInput = {
      title: "Salario",
      amount: 15000,
      type: "income",
      category: "salary",
      date: "2026-08-01",
    };
    const result = await createTransaction(input);

    expect(mockedPost).toHaveBeenCalledWith("/transactions", { data: input });
    expect(result.transaction._id).toBe("t1");
  });

  it("updateTransaction hace PATCH a /transactions/:id", async () => {
    mockedPatch.mockResolvedValueOnce(
      mockResponse({ message: "ok", transaction: mockTransaction }),
    );

    const result = await updateTransaction("t1", { amount: 16000 });

    expect(mockedPatch).toHaveBeenCalledWith("/transactions/t1", {
      data: { amount: 16000 },
    });
    expect(result.transaction._id).toBe("t1");
  });

  it("deleteTransaction hace DELETE a /transactions/:id", async () => {
    mockedDelete.mockResolvedValueOnce(mockResponse({ message: "eliminado" }));

    const result = await deleteTransaction("t1");

    expect(mockedDelete).toHaveBeenCalledWith("/transactions/t1");
    expect(result).toEqual({ message: "eliminado" });
  });
});
