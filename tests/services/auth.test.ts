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
import type { User } from "@/lib/types/auth";
import {
  deleteAccount,
  getProfile,
  login,
  logout,
  register,
  requestCode,
  updateProfile,
  uploadAvatar,
  verifyCode,
} from "@/services/auth";

const mockedPost = vi.mocked(apiClient.post);
const mockedGet = vi.mocked(apiClient.get);
const mockedPatch = vi.mocked(apiClient.patch);
const mockedDelete = vi.mocked(apiClient.delete);

const mockUser: User = {
  id: "1",
  firstName: "Ana",
  lastName: "López",
  email: "ana@correo.com",
  role: "user",
};

function mockResponse<T>(data: T) {
  return { data, status: 200, statusText: "OK", headers: {}, config: {} };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth service", () => {
  it("login envía credenciales a /auth/login", async () => {
    const authResponse = {
      message: "ok",
      access_token: "at",
      refresh_token: "rt",
      user: mockUser,
    };
    mockedPost.mockResolvedValueOnce(mockResponse(authResponse));

    const result = await login({ email: "ana@correo.com", password: "1234" });

    expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
      data: { email: "ana@correo.com", password: "1234" },
    });
    expect(result).toEqual(authResponse);
  });

  it("register envía datos y el token de verificación en el header", async () => {
    mockedPost.mockResolvedValueOnce(
      mockResponse({ message: "ok", access_token: "at", refresh_token: "rt", user: mockUser }),
    );

    await register(
      { firstName: "Ana", lastName: "López", password: "1234" },
      "verification-token",
    );

    expect(mockedPost).toHaveBeenCalledWith(
      "/auth/register",
      { data: { firstName: "Ana", lastName: "López", password: "1234" } },
      { headers: { Authorization: "Bearer verification-token" } },
    );
  });

  it("requestCode envía el email a /auth/request-code", async () => {
    mockedPost.mockResolvedValueOnce(mockResponse({ code: "123456", message: "ok" }));

    const result = await requestCode({ email: "ana@correo.com" });

    expect(mockedPost).toHaveBeenCalledWith("/auth/request-code", {
      data: { email: "ana@correo.com" },
    });
    expect(result.code).toBe("123456");
  });

  it("verifyCode envía email y código", async () => {
    mockedPost.mockResolvedValueOnce(
      mockResponse({ message: "ok", verification_token: "vt" }),
    );

    const result = await verifyCode({ email: "ana@correo.com", code: "123456" });

    expect(mockedPost).toHaveBeenCalledWith("/auth/verify-code", {
      data: { email: "ana@correo.com", code: "123456" },
    });
    expect(result.verification_token).toBe("vt");
  });

  it("getProfile devuelve el usuario desde el body anidado", async () => {
    mockedGet.mockResolvedValueOnce(mockResponse({ user: mockUser }));

    const result = await getProfile();

    expect(mockedGet).toHaveBeenCalledWith("/auth/profile");
    expect(result).toEqual(mockUser);
  });

  it("logout llama a /auth/logout", async () => {
    mockedPost.mockResolvedValueOnce(mockResponse({ message: "ok" }));

    await logout();

    expect(mockedPost).toHaveBeenCalledWith("/auth/logout");
  });

  it("updateProfile envía datos a /auth/profile", async () => {
    mockedPatch.mockResolvedValueOnce(mockResponse({ message: "ok", user: mockUser }));

    const result = await updateProfile({ firstName: "Ana", lastName: "López" });

    expect(mockedPatch).toHaveBeenCalledWith("/auth/profile", {
      data: { firstName: "Ana", lastName: "López" },
    });
    expect(result).toEqual(mockUser);
  });

  it("uploadAvatar envía un FormData multipart", async () => {
    mockedPost.mockResolvedValueOnce(mockResponse({ message: "ok", user: mockUser }));
    const file = new File(["x"], "avatar.png", { type: "image/png" });

    const result = await uploadAvatar(file);

    const [url, body, options] = mockedPost.mock.calls[0];
    expect(url).toBe("/auth/avatar");
    expect(body).toBeInstanceOf(FormData);
    expect(options?.headers).toEqual({ "Content-Type": "multipart/form-data" });
    expect(result).toEqual(mockUser);
  });

  it("deleteAccount llama a DELETE /auth/profile", async () => {
    mockedDelete.mockResolvedValueOnce(mockResponse({ message: "cuenta eliminada" }));

    const result = await deleteAccount();

    expect(mockedDelete).toHaveBeenCalledWith("/auth/profile");
    expect(result).toEqual({ message: "cuenta eliminada" });
  });
});
