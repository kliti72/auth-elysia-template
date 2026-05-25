export type Locale = "it" | "en";
export const LOCALES: Locale[] = ["it", "en"];
export const DEFAULT_LOCALE: Locale = "it";

export const translations = {
  it: {
    "app_name" : "AppName",
    "auth_sub": "Accedi con Google o ricevi un link magico via email per entrare senza password.",
    "google": "Continua con Google",
    "or": "oppure",
    "email": "La tua email",
    "magic_cta": "invia link magico",
    "magic_hint": "Riceverai un link valido per 15 minuti.",
    "terms_hint": "Continuando accetti i nostri",
    "terms": "Termini",
    "and": "e la",
    "privacy": "Privacy Policy",
    "sent_title": "Controlla la tua email",
    "sent_sub": "Abbiamo inviato il link a",
    "sent_hint": "Clicca il link nell'email per accedere. Controlla anche la cartella spam.",
    "resend": "← Usa un'altra email"
  },

  en: {
    sub_write: "Explore original poems written by versifiers from all over the world.",
  },
} satisfies Record<string, Record<string, string>>;

export type TranslationKey = keyof typeof translations.it;

export const getT = (lang: string): Record<string, string> => translations[lang as Locale] ?? translations[DEFAULT_LOCALE];