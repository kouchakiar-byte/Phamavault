import type { Metadata } from "next";
import { Estedad, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { InstallApp } from "@/components/install-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisitBeacon } from "@/components/visit-beacon";
import { copy, siteConfig } from "@/content/site";
import { localeDirection, locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/metadata";
import { getLocale } from "@/i18n/locale";
import "../globals.css";

// Persian text: Estedad, a sans designed for Persian, with true Persian letterforms.
const estedad = Estedad({
  variable: "--font-estedad",
  subsets: ["arabic", "latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Numbers use JetBrains Mono: tall, sturdy digits that stay legible at small sizes.
const numMono = JetBrains_Mono({
  variable: "--font-num-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      </body>
    </html>
  );
}
