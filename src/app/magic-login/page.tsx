"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyMagicToken } from "@/hooks/auth/mutations/useMagicLink";
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { getMutationErrorMessage } from "@/lib/api/error-message";

const MISSING_TOKEN_MESSAGE =
  "El enlace de acceso es inválido o ha expirado. Solicita uno nuevo.";

function MagicLinkErrorState({ message }: { message: string }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-semibold tracking-tight text-ink">
          No pudimos iniciar tu sesión
        </p>
        <p className="mx-auto max-w-xs text-sm text-ink-soft">{message}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/login" className="btn-primary sm:w-auto sm:px-7">
          Iniciar sesión
        </Link>
        <Link href="/register" className="btn-ghost sm:w-auto sm:px-7">
          Crear cuenta
        </Link>
      </div>
    </>
  );
}

function MagicLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verify = useVerifyMagicToken();
  const [apiError, setApiError] = useState<string | null>(null);
  const started = useRef(false);

  const token = searchParams?.get("token") ?? null;

  useEffect(() => {
    if (!token || started.current) return;

    started.current = true;
    verify.mutateAsync(token)
      .then(() => {
        setSessionCookie();
        router.replace("/dashboard");
        router.refresh();
      })
      .catch((err) => {
        setApiError(getMutationErrorMessage(err.code));
      });
  }, [token, router, verify]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <span className="flex size-10 items-center justify-center rounded-md bg-leaf-600 font-mono text-sm font-bold text-white">
        F
      </span>

      {!token || apiError ? (
        <MagicLinkErrorState message={apiError ?? MISSING_TOKEN_MESSAGE} />
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <p className="text-lg font-semibold tracking-tight text-ink">
              Verificando tu enlace…
            </p>
            <p className="text-sm text-ink-soft">
              Te estamos llevando a tu panel.
            </p>
          </div>
          <span
            className="size-6 animate-spin rounded-full border-2 border-line border-t-leaf-600"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}

export default function MagicLoginPage() {
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
      <MagicLoginContent />
    </Suspense>
  );
}
