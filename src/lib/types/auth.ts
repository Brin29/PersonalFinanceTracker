export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  provider?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  password: string;
}

export interface ProfileInput {
  firstName: string;
  lastName: string;
}

export interface RequestCodeInput {
  email: string;
}

export interface RequestCodeResponse {
  code: string;
  message: string;
}

export interface VerifyCodeInput {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  message: string;
  verification_token: string;
}

export interface ApiErrorBody {
  error?: string;
}

export interface EmailStepValues {
  email: string;
}

export interface CodeStepValues {
  code: string;
}

export interface RegisterStepValues {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
