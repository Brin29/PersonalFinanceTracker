import { describe, expect, it } from "vitest";
import reducer, { themeActions } from "@/store/theme/theme.slice";

const STORAGE_KEY = "pft_theme";

describe("theme slice", () => {
  it("inicia en light sin configuración", () => {
    const state = reducer(undefined, { type: "@@init" });
    expect(state.mode).toBe("light");
  });

  it("setTheme actualiza el estado y persiste", () => {
    const state = reducer(undefined, { type: "@@init" });
    const next = reducer(state, themeActions.setTheme("dark"));
    expect(next.mode).toBe("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("toggleTheme alterna light/dark", () => {
    let state = reducer(undefined, { type: "@@init" });
    state = reducer(state, themeActions.toggleTheme());
    expect(state.mode).toBe("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");

    state = reducer(state, themeActions.toggleTheme());
    expect(state.mode).toBe("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("toggleTheme persiste el modo resultante", () => {
    const state = reducer({ mode: "dark" }, themeActions.toggleTheme());
    expect(state.mode).toBe("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });
});
