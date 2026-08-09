import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function isTokenExpired(token: string, skewSeconds = 10): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= (exp - skewSeconds) * 1000;
  } catch {
    return true;
  }
}