import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, toDateInputValue } from "@/lib/utils/format";

describe("formatCurrency", () => {
  it("formatea valores enteros", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  it("formatea decimales", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formatea cero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formatea valores negativos", () => {
    expect(formatCurrency(-250.75)).toBe("-$250.75");
  });
});

describe("formatDate", () => {
  it("formatea una fecha en es-MX", () => {
    const date = new Date(2026, 7, 8, 12, 0, 0);
    expect(formatDate(date)).toBe("08 ago 2026");
  });

  it("acepta strings ISO", () => {
    expect(formatDate(new Date(2026, 0, 5, 12, 0, 0).toISOString())).toBe(
      "05 ene 2026",
    );
  });
});

describe("toDateInputValue", () => {
  it("devuelve el formato yyyy-mm-dd", () => {
    const date = new Date(2026, 7, 8, 12, 0, 0);
    expect(toDateInputValue(date)).toBe("2026-08-08");
  });

  it("rellena con ceros día y mes", () => {
    const date = new Date(2026, 2, 3, 12, 0, 0);
    expect(toDateInputValue(date)).toBe("2026-03-03");
  });

  it("acepta strings", () => {
    expect(toDateInputValue("2026-11-23T12:00:00")).toBe("2026-11-23");
  });
});
