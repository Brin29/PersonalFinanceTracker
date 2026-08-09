import axios from "axios";
import type { ApiErrorBody } from "../types/auth";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.error) return data.error;
    if (!error.response) {
      return "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
    }
    if (error.response.status === 401) {
      return "Credenciales incorrectas. Revisa e inténtalo de nuevo.";
    }
    if (error.response.status >= 500) {
      return "Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.";
    }
  }
  return fallback;
}
