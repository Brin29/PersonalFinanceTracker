import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { API_BASE_URL, apiClient } from "@/lib/api/client";
import { store } from "@/store";
import { loaderActions } from "@/store/network-loader/loader.slice";

const server = setupServer();

const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  server.resetHandlers();
  store.dispatch(loaderActions.reset());
  Object.defineProperty(window, "location", {
    configurable: true,
    value: realLocation,
  });
});

afterAll(() => server.close());

const realLocation = window.location;

function mockWindowLocation(pathname: string, search = "") {
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: {
      pathname,
      search,
      href: `http://localhost:3210${pathname}${search}`,
    },
  });
}

describe("apiClient", () => {
  describe("loader", () => {
    it("incrementa el loader mientras la request está en vuelo y lo resetea al terminar", async () => {
      let resolveResponse!: (value: Response) => void;
      server.use(
        http.get(`${API_BASE_URL}/slow`, () => {
          return new Promise<Response>((resolve) => {
            resolveResponse = resolve;
          });
        }),
      );

      const promise = apiClient.get("/slow");
      await vi.waitFor(() =>
        expect(store.getState().loader.activeRequests).toBe(1),
      );
      resolveResponse(HttpResponse.json({ ok: true }));
      await promise;

      expect(store.getState().loader.activeRequests).toBe(0);
    });

    it("respeta skipLoader", async () => {
      server.use(
        http.get(`${API_BASE_URL}/quiet`, () =>
          HttpResponse.json({ ok: true }),
        ),
      );

      const res = await apiClient.get("/quiet", { skipLoader: true });

      expect(res.data).toEqual({ ok: true });
      expect(store.getState().loader.activeRequests).toBe(0);
    });
  });

  describe("flujo de refresh", () => {
    it("reintenta la request tras refrescar el token en un 401", async () => {
      let attempts = 0;
      server.use(
        http.get(`${API_BASE_URL}/transactions`, () => {
          attempts += 1;
          return attempts === 1
            ? new HttpResponse(null, { status: 401 })
            : HttpResponse.json({ ok: true });
        }),
        http.post(REFRESH_URL, () => HttpResponse.json({ ok: true })),
      );

      const res = await apiClient.get("/transactions");

      expect(res.data).toEqual({ ok: true });
      expect(attempts).toBe(2);
      expect(store.getState().loader.activeRequests).toBe(0);
    });

    it("redirige a /login si el refresh también devuelve 401", async () => {
      mockWindowLocation("/movements", "?page=2");
      server.use(
        http.get(`${API_BASE_URL}/transactions`, () =>
          new HttpResponse(null, { status: 401 }),
        ),
        http.post(REFRESH_URL, () =>
          new HttpResponse(null, { status: 401 }),
        ),
      );

      await expect(apiClient.get("/transactions")).rejects.toBeTruthy();
      expect(window.location.href).toContain("/login?from=");
      expect(window.location.href).toContain(
        encodeURIComponent("/movements?page=2"),
      );
    });

    it("solo llama a refresh una vez con requests 401 concurrentes", async () => {
      let refreshCalls = 0;
      let aCalls = 0;
      let bCalls = 0;

      server.use(
        http.get(`${API_BASE_URL}/a`, () => {
          aCalls += 1;
          return aCalls === 1
            ? new HttpResponse(null, { status: 401 })
            : HttpResponse.json({ a: 1 });
        }),
        http.get(`${API_BASE_URL}/b`, () => {
          bCalls += 1;
          return bCalls === 1
            ? new HttpResponse(null, { status: 401 })
            : HttpResponse.json({ b: 2 });
        }),
        http.post(REFRESH_URL, () => {
          refreshCalls += 1;
          return HttpResponse.json({ ok: true });
        }),
      );

      const [ra, rb] = await Promise.all([
        apiClient.get("/a"),
        apiClient.get("/b"),
      ]);

      expect(ra.data).toEqual({ a: 1 });
      expect(rb.data).toEqual({ b: 2 });
      expect(refreshCalls).toBe(1);
      expect(store.getState().loader.activeRequests).toBe(0);
    });

    it("no refresca ni reintenta en errores que no son 401", async () => {
      const refreshSpy = vi.fn();
      server.use(
        http.get(`${API_BASE_URL}/broken`, () =>
          new HttpResponse(null, { status: 500 }),
        ),
        http.post(REFRESH_URL, () => {
          refreshSpy();
          return HttpResponse.json({ ok: true });
        }),
      );

      await expect(apiClient.get("/broken")).rejects.toBeTruthy();
      expect(refreshSpy).not.toHaveBeenCalled();
      expect(store.getState().loader.activeRequests).toBe(0);
    });
  });
});
