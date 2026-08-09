import { describe, expect, it } from "vitest";
import axios from "axios";
import { getApiErrorMessage } from "@/lib/api/errors";

function createAxiosError(
  status: number | undefined,
  data?: unknown,
): unknown {
  const response = status
    ? {
        status,
        data,
        statusText: "error",
        headers: {},
        config: {} as InternalAxiosRequestConfigStub,
      }
    : undefined;
  return new axios.AxiosError(
    "Request failed",
    status ? String(status) : "ERR_NETWORK",
    undefined,
    undefined,
    response as never,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InternalAxiosRequestConfigStub = any;

describe("getApiErrorMessage", () => {
  const fallback = "Mensaje por defecto";

  it("devuelve el error del servidor si viene en el body", () => {
    const error = createAxiosError(400, { error: "Correo ya registrado" });
    expect(getApiErrorMessage(error, fallback)).toBe("Correo ya registrado");
  });

  it("devuelve mensaje de conexión si no hay response", () => {
    const error = createAxiosError(undefined);
    expect(getApiErrorMessage(error, fallback)).toBe(
      "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    );
  });

  it("devuelve mensaje de credenciales en 401 sin body de error", () => {
    const error = createAxiosError(401, {});
    expect(getApiErrorMessage(error, fallback)).toBe(
      "Credenciales incorrectas. Revisa e inténtalo de nuevo.",
    );
  });

  it("devuelve mensaje de servidor en 5xx", () => {
    expect(getApiErrorMessage(createAxiosError(500), fallback)).toBe(
      "Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.",
    );
    expect(getApiErrorMessage(createAxiosError(503), fallback)).toBe(
      "Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.",
    );
  });

  it("usa el fallback para errores que no son de axios", () => {
    expect(getApiErrorMessage(new Error("boom"), fallback)).toBe(fallback);
    expect(getApiErrorMessage("string", fallback)).toBe(fallback);
    expect(getApiErrorMessage(null, fallback)).toBe(fallback);
  });

  it("usa el fallback para otros códigos", () => {
    expect(getApiErrorMessage(createAxiosError(404), fallback)).toBe(fallback);
  });
});
