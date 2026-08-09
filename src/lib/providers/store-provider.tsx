"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = () => {
      const { mode } = store.getState().theme;
      document.documentElement.classList.toggle("dark", mode === "dark");
    };

    applyTheme();
    const unsubscribe = store.subscribe(applyTheme);

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
