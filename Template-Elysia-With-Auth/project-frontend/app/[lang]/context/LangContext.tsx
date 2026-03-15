// app/context/LangContext.tsx
"use client";

import { createContext, useContext } from "react";

const LangContext = createContext<string>("it");

export function LangProvider({ lang, children }: { lang: string; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

