import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCategories } from "@/hooks/categories/queries/useCategories";
import { createTestWrapper } from "@test/test-utils";
import type { CategoriesResponse } from "@/lib/types/category";

const mocks = vi.hoisted(() => ({
  getCategories: vi.fn(),
}));

vi.mock("@/services/categories", () => ({
  getCategories: mocks.getCategories,
}));

const response: CategoriesResponse = {
  categories: [
    {
      _id: "c1",
      name: "Comida",
      key: "food",
      type: "expense",
      isSystem: true,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  ],
};

describe("useCategories", () => {
  it("devuelve las categorías", async () => {
    mocks.getCategories.mockResolvedValueOnce(response);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mocks.getCategories).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(response);
  });

  it("propaga el error de la API", async () => {
    mocks.getCategories.mockRejectedValueOnce(new Error("sin sesión"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
