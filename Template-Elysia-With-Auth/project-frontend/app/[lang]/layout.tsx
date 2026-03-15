// app/[lang]/layout.tsx — LANG (zero html/body qui!)

import { Metadata } from "next";
import { DEFAULT_LOCALE, getT, Locale, LOCALES } from "./i18n/translations";
import { Providers } from "../provider";
import { AuthProvider } from "./context/AuthContext";
import { LangProvider } from "./context/LangContext";

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang);
  return {
    title: t.meta_title,
    description: t.meta_description,
    metadataBase: new URL("https://versify.art"),
    alternates: {
      languages: Object.fromEntries(LOCALES.map(l => [l, `/${l}`])),
    },
  };
}

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = LOCALES.includes(lang as Locale) ? lang : DEFAULT_LOCALE;

  return (
    <Providers>
      <AuthProvider>
            <LangProvider lang={locale}>
              <main className="pt-30">
                {children}
              </main>
            </LangProvider>
      </AuthProvider>
    </Providers>
  );
}