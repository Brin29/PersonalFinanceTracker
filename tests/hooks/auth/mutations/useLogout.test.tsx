import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLogout } from "@/hooks/auth/mutations/useLogout";
import { createTestWrapper } from "@test/test-utils";

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
  logout: mocks.logout,
}));

describe("useLogout", () => {
  it("llama al servicio de logout", async () => {
    mocks.logout.mockResolvedValueOnce(undefined);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mocks.logout).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("propaga el error del servicio", async () => {
    mocks.logout.mockRejectedValueOnce(new Error("sin sesión"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow("sin sesión");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
