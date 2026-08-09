import { describe, expect, it } from "vitest";
import {
  DEFAULT_MUTATION_ERROR_MESSAGE,
  getMutationErrorMessage,
  MUTATION_ERROR_MESSAGES,
} from "@/lib/api/error-message";

describe("getMutationErrorMessage", () => {
  it("devuelve el mensaje mapeado para códigos conocidos", () => {
    expect(getMutationErrorMessage("INVALID_CREDENTIALS")).toBe(
      MUTATION_ERROR_MESSAGES.INVALID_CREDENTIALS,
    );
    expect(getMutationErrorMessage("EMAIL_ALREADY_REGISTERED")).toBe(
      MUTATION_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED,
    );
    expect(getMutationErrorMessage("TRANSACTION_NOTFOUND")).toBe(
      MUTATION_ERROR_MESSAGES.TRANSACTION_NOTFOUND,
    );
  });

  it("devuelve el mensaje por defecto para códigos desconocidos", () => {
    expect(getMutationErrorMessage("UNKNOWN_CODE")).toBe(
      DEFAULT_MUTATION_ERROR_MESSAGE,
    );
    expect(getMutationErrorMessage("")).toBe(DEFAULT_MUTATION_ERROR_MESSAGE);
  });

  it("cubre todos los códigos definidos en el mapa", () => {
    expect(Object.keys(MUTATION_ERROR_MESSAGES).length).toBeGreaterThan(0);
    Object.keys(MUTATION_ERROR_MESSAGES).forEach((code) => {
      expect(getMutationErrorMessage(code)).not.toBe(DEFAULT_MUTATION_ERROR_MESSAGE);
    });
  });
});
