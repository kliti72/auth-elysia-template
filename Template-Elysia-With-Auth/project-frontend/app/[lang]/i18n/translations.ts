// app/i18n/translations.ts
export type Locale = "it" | "en" | "fr" | "es" | "pt" | "de";

export const LOCALES: Locale[] = ["it", "en", "fr", "es", "pt", "de"];
export const DEFAULT_LOCALE: Locale = "it";

export const translations = {
  it: {
    write:    "Scrivi",
  },

  en: {
    sub_write: "Explore original poems written by versifiers from all over the world.",
  },

  fr: {
    write:    "Écrire",
  },

  es: {
    write:    "Escribir",
  },

  pt: {
    write:    "Escrever",
  },

  de: {
    write:    "Schreiben",
  },
} satisfies Record<string, Record<string, string>>;

export type TranslationKey = keyof typeof translations.it;

export const getT = (lang: string): Record<string, string> =>
  translations[lang as Locale] ?? translations[DEFAULT_LOCALE];