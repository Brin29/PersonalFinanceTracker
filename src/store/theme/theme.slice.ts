import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "pft_theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  if (document.documentElement.classList.contains("dark")) return "dark";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",

  initialState,

  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      window.localStorage.setItem(STORAGE_KEY, action.payload);
    },

    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, state.mode);
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
