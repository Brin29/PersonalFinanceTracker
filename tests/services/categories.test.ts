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
import type { Category } from "@/lib/types/category";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categories";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);
const mockedPatch = vi.mocked(apiClient.patch);
const mockedDelete = vi.mocked(apiClient.delete);

const mockCategory: Category = {
  _id: "c1",
  name: "Comida",
  key: "food",
  type: "expense",
  isSystem: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

function mockResponse<T>(data: T) {
  return { data, status: 200, statusText: "OK", headers: {}, config: {} };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("categories service", () => {
  it("getCategories llama a GET /categories", async () => {
    mockedGet.mockResolvedValueOnce(mockResponse({ categories: [mockCategory] }));

    const result = await getCategories();

    expect(mockedGet).toHaveBeenCalledWith("/categories");
    expect(result.categories).toHaveLength(1);
  });

  it("createCategory envía el payload a /categories", async () => {
    mockedPost.mockResolvedValueOnce(
      mockResponse({ message: "ok", category: mockCategory }),
    );

    const result = await createCategory({ name: "Comida", type: "expense" });

    expect(mockedPost).toHaveBeenCalledWith("/categories", {
      data: { name: "Comida", type: "expense" },
    });
    expect(result.category._id).toBe("c1");
  });

  it("updateCategory hace PATCH a /categories/:id", async () => {
    mockedPatch.mockResolvedValueOnce(
      mockResponse({ message: "ok", category: mockCategory }),
    );

    const result = await updateCategory("c1", { name: "Comidas" });

    expect(mockedPatch).toHaveBeenCalledWith("/categories/c1", {
      data: { name: "Comidas" },
    });
    expect(result.category.name).toBe("Comida");
  });

  it("deleteCategory hace DELETE a /categories/:id", async () => {
    mockedDelete.mockResolvedValueOnce(mockResponse({ message: "eliminada" }));

    const result = await deleteCategory("c1");

    expect(mockedDelete).toHaveBeenCalledWith("/categories/c1");
    expect(result).toEqual({ message: "eliminada" });
  });
});
