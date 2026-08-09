import Link from "next/link";
import type { ReactNode } from "react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  icon: ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
          {icon}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink">
            Aún no hay nada por aquí
          </p>
          <p className="max-w-xs text-sm text-ink-soft">
            Esta sección está en construcción. Mientras tanto, empieza por
            registrar tus primeros movimientos.
          </p>
        </div>
        <Link href={actionHref} className="btn-primary mt-2 w-auto px-6">
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
