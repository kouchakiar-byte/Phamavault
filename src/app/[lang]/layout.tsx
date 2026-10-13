import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Vazirmatn } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, siteConfig } from "@/content/site";
import { localeDirection, locales } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import "../globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
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
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      siteName: siteConfig.name,
      title: copy.meta.title[locale],
      description: copy.meta.description[locale],
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`locale-${locale} ${vazirmatn.variable} ${plexSans.variable} ${numMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
        >
          {copy.nav.skipToContent[locale]}
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
