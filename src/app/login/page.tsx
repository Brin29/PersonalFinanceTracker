import { Suspense } from "react";
import type { Metadata } from "next";
import LoginContent from "@/components/auth/login-content";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Accede a tu panel en Finance para revisar tus movimientos y mantener tu dinero al día.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-paper px-6">
          <div className="h-40 w-full max-w-sm animate-pulse rounded-2xl border border-line bg-surface" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
