"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,border-color] bg-paper/85 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)] backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-leaf-600 font-mono text-xs font-bold text-white">
            F
          </span>
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-ink">
            Finance
          </span>
        </div>
        <Link href="/login" className="btn-primary sm:w-auto sm:px-7">
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
