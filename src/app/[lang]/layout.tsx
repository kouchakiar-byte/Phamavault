import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { CopyAllowance } from "@/components/copy-allowance";
import { CopyGuard } from "@/components/copy-guard";
import { InstallApp } from "@/components/install-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisitBeacon } from "@/components/visit-beacon";
import { copy, siteConfig } from "@/content/site";
import { localeDirection, locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/metadata";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import "../globals.css";

// Fonts are bundled with the site (src/app/fonts, all SIL OFL) rather than fetched
// from Google at build time, which the Iran build servers cannot always reach.

// Persian text: Estedad, a sans designed for Persian, with true Persian letterforms.
const estedad = localFont({
  variable: "--font-estedad",
  src: [
    { path: "../fonts/Estedad-Regular.woff2", weight: "400" },
    { path: "../fonts/Estedad-Medium.woff2", weight: "500" },
    { path: "../fonts/Estedad-SemiBold.woff2", weight: "600" },
    { path: "../fonts/Estedad-Bold.woff2", weight: "700" },
    { path: "../fonts/Estedad-ExtraBold.woff2", weight: "800" },
  ],
});

const plexSans = localFont({
  variable: "--font-plex-sans",
  src: [
    { path: "../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/ibm-plex-sans-latin-700-normal.woff2", weight: "700" },
  ],
});

// Numbers use JetBrains Mono: tall, sturdy digits that stay legible at small sizes.
const numMono = localFont({
  variable: "--font-num-mono",
  src: [
    { path: "../fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/jetbrains-mono-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700" },
  ],
});

export function generateStaticParams() {
  return locales.map((l) => ({ lang: l }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: copy.meta.title[locale], template: `%s | ${siteConfig.name}` },
    description: copy.meta.description[locale],
    alternates: { canonical: `/${locale}`, languages: languageAlternates("") },
    openGraph: {
      siteName: siteConfig.name,
      title: copy.meta.title[locale],
      description: copy.meta.description[locale],
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: copy.meta.title[locale] }],
    },
    twitter: { card: "summary_large_image", title: copy.meta.title[locale], description: copy.meta.description[locale], images: ["/og.png"] },
    ...(siteConfig.enamadVerify ? { other: { enamad: siteConfig.enamadVerify } } : {}),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`locale-${locale} ${estedad.variable} ${plexSans.variable} ${numMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
        >
          {copy.nav.skipToContent[locale]}
        </a>
        <script
          type="application/ld+json"
          // Organization and WebSite structured data for search engines.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "PharmaVault",
                alternateName: ["گنجینه اطلاعات داروسازی", "The Pharmaceutical Information Vault"],
                url: siteConfig.url,
                logo: `${siteConfig.url}/og-logo.png`,
                email: siteConfig.email,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "PharmaVault",
                alternateName: "گنجینه اطلاعات داروسازی",
                url: siteConfig.url,
                inLanguage: ["fa-IR", "en"],
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.url}/fa/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <InstallApp locale={locale} />
        <VisitBeacon />
        <CopyGuard
          buyHref={href(locale, "account/buy")}
          labels={{
            title: copy.copyGuard.title[locale],
            text: copy.copyGuard.text[locale],
            buy: copy.copyGuard.buy[locale],
            close: copy.copyGuard.close[locale],
          }}
        />
        <Suspense fallback={null}>
          <CopyAllowance />
        </Suspense>
      </body>
    </html>
  );
}
