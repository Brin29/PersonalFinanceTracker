import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";
import Loader from "@/components/common/Loader";
import { StoreProvider } from "@/lib/providers/store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Finance · Finanzas personales",
    template: "%s · Finance",
  },
  description:
    "Registra tus ingresos y gastos, y mantén tus finanzas personales al día.",
  alternates: {
    canonical: "/",
  },
  keywords: ["Finanzas", "Finanzas personales", "Ingresos", "Gastos"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Finance",
    title: "Finance · Finanzas personales",
    description:
      "Registra tus ingresos y gastos, y mantén tus finanzas personales al día.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    }
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="pft_theme";var s=window.localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <StoreProvider>
            <Loader />
            {children}
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
