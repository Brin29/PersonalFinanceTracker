import { describe, expect, it } from "vitest";
import reducer, { loaderActions } from "@/store/network-loader/loader.slice";

describe("loader slice", () => {
  it("inicia en cero", () => {
    const state = reducer(undefined, { type: "@@init" });
    expect(state.activeRequests).toBe(0);
  });

  it("increment suma uno", () => {
    const state = reducer({ activeRequests: 2 }, loaderActions.increment());
    expect(state.activeRequests).toBe(3);
  });

  it("decrement resta uno", () => {
    const state = reducer({ activeRequests: 2 }, loaderActions.decrement());
    expect(state.activeRequests).toBe(1);
  });

  it("decrement no baja de cero", () => {
    const state = reducer({ activeRequests: 0 }, loaderActions.decrement());
    expect(state.activeRequests).toBe(0);
  });

  it("reset vuelve a cero", () => {
    const state = reducer({ activeRequests: 5 }, loaderActions.reset());
    expect(state.activeRequests).toBe(0);
  });
});
