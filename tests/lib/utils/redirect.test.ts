import { describe, expect, it } from "vitest";
import { resolvePostAuthPath } from "@/lib/utils/redirect";

describe("resolvePostAuthPath", () => {
  it("usa /dashboard como fallback sin destino", () => {
    expect(resolvePostAuthPath(null)).toBe("/dashboard");
    expect(resolvePostAuthPath(undefined)).toBe("/dashboard");
    expect(resolvePostAuthPath("")).toBe("/dashboard");
  });

  it("rechaza URLs absolutas", () => {
    expect(resolvePostAuthPath("https://evil.com")).toBe("/dashboard");
    expect(resolvePostAuthPath("http://evil.com/path")).toBe("/dashboard");
  });

  it("rechaza rutas protocol-relative y con backslash", () => {
    expect(resolvePostAuthPath("//evil.com")).toBe("/dashboard");
    expect(resolvePostAuthPath("/\\evil")).toBe("/dashboard");
    expect(resolvePostAuthPath("//")).toBe("/dashboard");
  });

  it("rechaza rutas de autenticación bloqueadas", () => {
    expect(resolvePostAuthPath("/login")).toBe("/dashboard");
    expect(resolvePostAuthPath("/register")).toBe("/dashboard");
    expect(resolvePostAuthPath("/oauth-success")).toBe("/dashboard");
    expect(resolvePostAuthPath("/login?from=x")).toBe("/dashboard");
  });

  it("permite rutas internas válidas", () => {
    expect(resolvePostAuthPath("/movements")).toBe("/movements");
    expect(resolvePostAuthPath("/categories")).toBe("/categories");
    expect(resolvePostAuthPath("/settings")).toBe("/settings");
  });

  it("conserva el query string", () => {
    expect(resolvePostAuthPath("/movements?page=2")).toBe("/movements?page=2");
  });

  it("respeta un fallback personalizado", () => {
    expect(resolvePostAuthPath(null, "/custom")).toBe("/custom");
  });
});
