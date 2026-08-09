"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resolvePostAuthPath } from "@/lib/utils/redirect";

function OAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams?.get("from");
    const redirectPath = resolvePostAuthPath(from);
    const timer = setTimeout(() => {
      router.replace(redirectPath);
      router.refresh();
    }, 900);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <span className="flex size-10 items-center justify-center rounded-md bg-leaf-600 font-mono text-sm font-bold text-white">
        L
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-semibold tracking-tight text-ink">
          Sesión iniciada correctamente
        </p>
        <p className="text-sm text-ink-soft">
          Te estamos llevando a tu panel…
        </p>
      </div>
      <span
        className="size-6 animate-spin rounded-full border-2 border-line border-t-leaf-600"
        aria-hidden="true"
      />
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
          <span
            className="size-6 animate-spin rounded-full border-2 border-line border-t-leaf-600"
            aria-hidden="true"
          />
        </div>
      }
    >
      <OAuthSuccessContent />
    </Suspense>
  );
}
