"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Field } from "@/components/ui/field";
import { InfoModal, type FeedbackInfo } from "@/components/ui/info-modal";
import { useLogin } from "@/hooks/auth/mutations/useLogin";
import { getApiErrorMessage } from "@/lib/api/errors";
import { resolvePostAuthPath } from "@/lib/utils/redirect";
import type { LoginInput } from "@/lib/types/auth";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const from = searchParams?.get("from");
  const redirectPath = resolvePostAuthPath(from); // Redirect URL Proxy

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      await login.mutateAsync(data);
      router.replace(redirectPath);
      router.refresh();
    } catch (error) {
      // Actualizar lista de mensajes de
      setFeedback({
        tone: "error",
        title: "No se pudo iniciar sesión",
        message: getApiErrorMessage(error, "No se pudo iniciar sesión."),
      });
    }
  };

  const isBusy = isSubmitting || login.isPending;

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenido de vuelta
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {from ? (
              <>
                Tu sesión expiró. Inicia sesión para continuar donde te
                quedaste.
              </>
            ) : (
              <>
                Inicia sesión para revisar tus movimientos y mantener tu dinero
                al día.
              </>
            )}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Field
            id="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Ingresa tu correo.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ingresa un correo válido.",
              },
            })}
          />

          <Field
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Ingresa tu contraseña.",
            })}
          />

          <button type="submit" className="btn-primary mt-2" disabled={isBusy}>
            {isBusy ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>
        </form>

        <OAuthButtons redirectPath={redirectPath} />

        <p className="text-center text-sm text-ink-soft">
          ¿Aún no tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-leaf-600 hover:text-leaf-700"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>

      {feedback ? (
        <InfoModal
          open={true}
          feedback={feedback}
          onAccept={() => setFeedback(null)}
        />
      ) : null}
    </AuthShell>
  );
}
