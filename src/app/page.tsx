import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense, type ComponentType } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardIcon from "@/components/ui/icons/dashboardIcon";
import TransferIcon from "@/components/ui/icons/transferIcon";
import TagIcon from "@/components/ui/icons/tagIcon";
import { BalanceCard } from "@/components/auth/balance-card";

export const metadata: Metadata = {
  title: "Finanzas personales en un solo lugar",
  description:
    "Finance es una aplicación gratuita para registrar tus ingresos y gastos, visualizar tu balance y mantener tus finanzas personales al día.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Finance",
    title: "Finanzas personales en un solo lugar",
    description:
      "Registra tus ingresos y gastos, visualiza tu balance y mantén tus finanzas personales al día con Finance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance · Finanzas personales en un solo lugar",
    description:
      "Registra tus ingresos y gastos, visualiza tu balance y mantén tus finanzas personales al día con Finance.",
  },
};

const FEATURES = [
  {
    icon: TransferIcon,
    title: "Registra al instante",
    description:
      "Anota ingresos y gastos en segundos. Tu historial queda organizado y siempre disponible.",
    image: "/landingimg1.png",
  },
  {
    icon: DashboardIcon,
    title: "Visualiza tu balance",
    description:
      "Resumen de ingresos, gastos y balance neto por día o por mes, sin hojas de cálculo.",
    image: "/landingimg2.png",
  },
  {
    icon: TagIcon,
    title: "Organiza por categorías",
    description:
      "Etiqueta cada movimiento para entender a dónde va tu dinero y tomar mejores decisiones.",
    image: "/landingimg3.png",
  },
];

interface FeatureCardProps {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description: string;
  image: string;
}

function FeatureCard({ icon: Icon, title, description, image }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-leaf-50 text-leaf-600">
        <Icon size={18} />
      </span>
      <h2 className="mt-4 text-base font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {description}
      </p>
      <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-line">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          loading="lazy"
          className="object-cover"
        />
      </div>
    </div>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Finance",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      inLanguage: "es",
    },
    {
      "@type": "SoftwareApplication",
      name: "Finance",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "es",
      description:
        "Aplicación gratuita para registrar tus ingresos y gastos y mantener tus finanzas personales al día.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default async function HomePage() {
  const cookieStore = await cookies();
  if (cookieStore.has("refresh_token") || cookieStore.has("auth_session")) {
    redirect("/dashboard");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-dvh flex-col">
        <main className="flex flex-1 flex-col">
          <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/landingvideo.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink/70" />

            <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-paper/70">
                Finanzas personales · sin complicaciones
              </p>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-6xl">
                Tu dinero,
                <br />
                <span className="text-leaf-500">siempre al día.</span>
              </h1>

              <p className="max-w-md text-base leading-relaxed text-paper/75">
                Registra tus ingresos y gastos, y toma el control de tus
                finanzas desde un solo lugar.
              </p>

              <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-paper/30 px-7 text-sm font-semibold text-paper transition-colors hover:bg-paper/10 sm:w-auto"
                >
                  Crear cuenta gratis
                </Link>
                <Link href="/login" className="btn-primary sm:w-auto sm:px-7">
                  Iniciar sesión
                </Link>
              </div>

              <p className="text-xs text-paper/60">
                Gratis para siempre · Sin tarjeta · Tus datos son privados
              </p>
            </div>
          </section>

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
            <section aria-label="Demo de la aplicación" className="py-12 sm:py-20">
              <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Así se ve tu balance
              </h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                Una vista clara de tus ingresos y gastos, día a día o por mes.
              </p>
              <div className="mt-6">
                <Suspense
                  fallback={
                    <div className="h-80 animate-pulse rounded-2xl bg-surface" />
                  }
                >
                  <BalanceCard mock />
                </Suspense>
              </div>
            </section>

            <section
              aria-label="Características"
              className="grid gap-3 pb-12 sm:grid-cols-3 sm:pb-20"
            >
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                />
              ))}
          </section>

          <section
            aria-label="Empieza hoy"
            className="mb-12 flex flex-col items-start gap-5 rounded-2xl bg-ink p-6 text-paper sm:mb-20 sm:flex-row sm:items-center sm:justify-between sm:p-10 dark:bg-[#18221d] dark:text-ink"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Empieza a llevar el control hoy
              </h2>
              <p className="mt-1.5 text-sm text-paper/70 dark:text-ink/70">
                Crea tu cuenta gratis y ten tu dinero siempre al día.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-leaf-500 px-7 text-sm font-semibold text-ink transition-colors hover:bg-leaf-500/90"
            >
              Crear cuenta gratis
            </Link>
          </section>
          </div>
        </main>
      </div>
    </>
  );
}
