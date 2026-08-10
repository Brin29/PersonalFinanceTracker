"use client";

import { useSyncExternalStore } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { themeActions } from "@/store/theme/theme.slice";
import SunIcon from "@/components/ui/icons/sunIcon";
import MoonIcon from "@/components/ui/icons/moonIcon";

const emptySubscribe = () => () => {};

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const currentMode = mounted ? mode : "light";

  return (
    <button
      type="button"
      onClick={() => dispatch(themeActions.toggleTheme())}
      className={`rounded-lg p-2 transition-colors ${
        onDark
          ? "text-paper/80 hover:bg-white/10 hover:text-paper"
          : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
      aria-label={
        currentMode === "dark"
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      title={currentMode === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      {currentMode === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
