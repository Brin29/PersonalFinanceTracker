import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { createTestWrapper } from "@test/test-utils";
import type { User } from "@/lib/types/auth";

const mocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
  getProfile: mocks.getProfile,
}));

const mockUser: User = {
  id: "1",
  firstName: "Ana",
  lastName: "López",
  email: "ana@correo.com",
  role: "user",
};

describe("useProfile", () => {
  it("devuelve el perfil del usuario", async () => {
    mocks.getProfile.mockResolvedValueOnce(mockUser);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(mocks.getProfile).toHaveBeenCalledTimes(1);
  });

  it("propaga el error de la API", async () => {
    mocks.getProfile.mockRejectedValueOnce(new Error("sin sesión"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("useProfile con act", () => {
  it("se puede forzar un refetch", async () => {
    mocks.getProfile.mockResolvedValue(mockUser);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.refetch();
    });

    expect(mocks.getProfile).toHaveBeenCalledTimes(2);
  });
});
