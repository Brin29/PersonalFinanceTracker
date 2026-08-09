import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { store } from "@/store";
import { loaderActions } from "@/store/network-loader/loader.slice";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipLoader?: boolean;
    _retry?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function subscribeToRefresh(cb: () => void) {
  pendingQueue.push(cb);
}

function onRefreshed() {
  pendingQueue.forEach((cb) => cb());
  pendingQueue = [];
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  const destination = window.location.pathname + window.location.search;
  if (window.location.pathname !== "/login") {
    window.location.href = `/login?from=${encodeURIComponent(destination)}`;
  }
}

// --- Request interceptor: solo maneja el loader, nada de tokens ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.skipLoader) {
      store.dispatch(loaderActions.increment());
    }
    return config;
  },
  (error) => {
    store.dispatch(loaderActions.decrement());
    return Promise.reject(error);
  }
);

// --- Response interceptor: maneja loader + refresh + redirect ---
apiClient.interceptors.response.use(
  (response) => {
    if (!response.config.skipLoader) {
      store.dispatch(loaderActions.decrement());
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig;

    if (!original?.skipLoader) {
      store.dispatch(loaderActions.decrement());
    }

    const isRefreshCall = original?.url?.includes("/auth/refresh");

    // Si el propio endpoint de refresh devuelve 401, el refresh token también murió
    if (error.response?.status === 401 && isRefreshCall) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Cualquier otra request con 401: intenta refrescar y reintentar
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // El backend rota las cookies (access_token + refresh_token) via Set-Cookie
          await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          onRefreshed();
        } catch (refreshError) {
          pendingQueue = [];
          redirectToLogin();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }

        return apiClient(original);
      }

      return new Promise((resolve, reject) => {
        subscribeToRefresh(() => {
          apiClient(original).then(resolve).catch(reject);
        });
      });
    }

    return Promise.reject(error);
  }
);