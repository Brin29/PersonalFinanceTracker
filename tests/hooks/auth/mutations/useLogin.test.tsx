import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useLogin } from "@/hooks/auth/mutations/useLogin";
import { useProfile } from "@/hooks/profile/queries/useProfile";
import { createTestWrapper } from "@test/test-utils";
import type { AuthResponse, User } from "@/lib/types/auth";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  getProfile: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
  login: mocks.login,
  getProfile: mocks.getProfile,
}));

const mockUser: User = {
  id: "1",
  firstName: "Ana",
  lastName: "López",
  email: "ana@correo.com",
  role: "user",
};

const mockAuthResponse: AuthResponse = {
  code: "LOGIN_SUCCESS",
  message: "ok",
  access_token: "at",
  refresh_token: "rt",
  user: mockUser,
};

const loginInput = { email: "ana@correo.com", password: "1234" };

describe("useLogin", () => {
  it("llama al servicio de login con las credenciales", async () => {
    mocks.login.mockResolvedValueOnce(mockAuthResponse);

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(loginInput);
    });

    expect(mocks.login).toHaveBeenCalledWith(loginInput, expect.anything());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("invalida la query de perfil tras iniciar sesión", async () => {
    mocks.getProfile.mockResolvedValue(mockUser);
    mocks.login.mockResolvedValueOnce(mockAuthResponse);

    const wrapper = createTestWrapper();
    const { result } = renderHook(
      () => {
        const profile = useProfile();
        const login = useLogin();
        return { profile, login };
      },
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current.profile.data).toEqual(mockUser),
    );
    expect(mocks.getProfile).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.login.mutateAsync(loginInput);
    });

    await waitFor(() => {
      expect(mocks.getProfile).toHaveBeenCalledTimes(2);
    });
  });

  it("propaga el error si el login falla", async () => {
    mocks.login.mockRejectedValueOnce(new Error("credenciales inválidas"));

    const wrapper = createTestWrapper();
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(loginInput)).rejects.toThrow(
        "credenciales inválidas",
      );
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
