import { apiClient } from "../lib/api/client";
import type {
  AuthResponse,
  LoginInput,
  ProfileInput,
  RegisterInput,
  RequestCodeInput,
  RequestCodeResponse,
  User,
  VerifyCodeInput,
  VerifyCodeResponse,
} from "../lib/types/auth";

export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", { data });
  return response.data;
}

export async function register(data: RegisterInput, verificationToken: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    { data },
    {
      headers: {
        Authorization: `Bearer ${verificationToken}`,
      },
    },
  );
  return response.data;
}

export async function requestCode(
  data: RequestCodeInput,
): Promise<RequestCodeResponse> {
  const response = await apiClient.post<RequestCodeResponse>(
    "/auth/request-code",
    { data },
  );
  return response.data;
}

export async function verifyCode(
  data: VerifyCodeInput,
): Promise<VerifyCodeResponse> {
  const response = await apiClient.post<VerifyCodeResponse>("/auth/verify-code", {
    data,
  });
  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<{ user: User }>("/auth/profile");
  return response.data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function updateProfile(data: ProfileInput): Promise<User> {
  const response = await apiClient.patch<{ message: string; user: User }>(
    "/auth/profile",
    { data },
  );
  return response.data.user;
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post<{ message: string; user: User }>(
    "/auth/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.user;
}

export async function deleteAccount(): Promise<{ message: string }> {
  const response = await apiClient.delete("/auth/profile");
  return response.data;
}
