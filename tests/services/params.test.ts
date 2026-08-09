import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { apiClient } from "@/lib/api/client";
import { getParams } from "@/services/params";

const mockedGet = vi.mocked(apiClient.get);

function mockResponse<T>(data: T) {
  return { data, status: 200, statusText: "OK", headers: {}, config: {} };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("params service", () => {
  it("getParams llama a GET /params y devuelve el modelo", async () => {
    mockedGet.mockResolvedValueOnce(
      mockResponse({
        categories: [{ key: "food", name: "Comida", type: "expense" }],
        types: [
          { value: "income", label: "Ingreso" },
          { value: "expense", label: "Gasto" },
        ],
        periods: [{ value: "30d", label: "30 días" }],
      }),
    );

    const result = await getParams();

    expect(mockedGet).toHaveBeenCalledWith("/params");
    expect(result.categories).toHaveLength(1);
    expect(result.types).toHaveLength(2);
  });
});
