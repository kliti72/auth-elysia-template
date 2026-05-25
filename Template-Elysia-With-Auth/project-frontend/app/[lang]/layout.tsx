import { Metadata } from "next";
import { Providers } from "../provider";
import { AuthProvider } from "./context/AuthContext";
import { LangProvider } from "./context/LangContext";

import { DEFAULT_LOCALE, Locale, LOCALES } from "./i18n/translations";

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
              <main>
                {children}
              </main>
            </LangProvider>
      </AuthProvider>
    </Providers>
  );
}