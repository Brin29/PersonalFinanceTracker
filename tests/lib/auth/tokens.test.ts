import { describe, expect, it, beforeEach } from "vitest";
import {
  getAccessToken,
  isTokenExpired,
  setAccessToken,
} from "@/lib/auth/tokens";

function buildToken(exp: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "1", exp }));
  return `${header}.${payload}.signature`;
}

describe("setAccessToken / getAccessToken", () => {
  beforeEach(() => {
    setAccessToken(null);
  });

  it("guarda y devuelve el token", () => {
    expect(getAccessToken()).toBeNull();
    setAccessToken("token-123");
    expect(getAccessToken()).toBe("token-123");
  });

  it("limpia el token con null", () => {
    setAccessToken("token-123");
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});

describe("isTokenExpired", () => {
  it("devuelve false para tokens vigentes", () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    expect(isTokenExpired(buildToken(future))).toBe(false);
  });

  it("devuelve true para tokens expirados", () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    expect(isTokenExpired(buildToken(past))).toBe(true);
  });

  it("considera el margen de seguridad (skew)", () => {
    const nearExpiry = Math.floor(Date.now() / 1000) + 5;
    expect(isTokenExpired(buildToken(nearExpiry))).toBe(true);
  });

  it("devuelve true con tokens inválidos", () => {
    expect(isTokenExpired("no-es-un-jwt")).toBe(true);
    expect(isTokenExpired("")).toBe(true);
  });
});
