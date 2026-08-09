import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-paper px-6 py-12">
      <Link
        href="/"
        className="flex items-center gap-2.5"
        aria-label="Finance · Inicio"
      >
        <span className="flex size-7 items-center justify-center rounded-md bg-leaf-600 font-mono text-xs font-bold text-white">
          F
        </span>
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-ink">
          Finance
        </span>
      </Link>

      <div className="flex flex-col items-center gap-5 text-center">
        <Image
          src="/notfound.png"
          alt="Ilustración de página no encontrada"
          width={518}
          height={482}
          priority
          className="w-52 sm:w-64"
        />
        <div className="flex flex-col gap-1.5">
          <h1 className="text-7xl font-bold tracking-tight text-ink">
            404
          </h1>

          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Página no encontrada
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            La página que buscas no existe o fue movida. Revisa la dirección o
            vuelve al inicio para continuar.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
        <Link href="/login" className="btn-ghost">
          Iniciar sesión
        </Link>
      </div>

      <p className="text-xs text-ink-soft">
        © {new Date().getFullYear()} Finance · Finanzas personales
      </p>
    </div>
  );
}
