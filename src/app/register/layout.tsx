import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea tu cuenta gratis en Ledger y lleva tus finanzas personales bajo control.",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
