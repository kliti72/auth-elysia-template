"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { getT } from "../i18n/translations";

export default function Header() {
  const lang = useLang();
  const tr = getT(lang);
  const { user, status } = useAuth();

  return (
    <header className="w-full px-5 py-5 flex items-center justify-between border-b border-white/5">
      <Link href={`/${lang}`} className="text-white tracking-[0.15em] text-sm">{tr.app_name}</Link>
      <nav className="hidden md:flex items-center gap-6 text-xs text-[#555]">
        <Link href={`/${lang}`} className="hover:text-white transition-colors">Home</Link>
        <Link href={`/${lang}/promo`} className="hover:text-white transition-colors">Promo</Link>
        <Link href={`/${lang}/admin`} className="hover:text-white transition-colors">Amministrazione</Link>
      </nav>
      {status === "authenticated" && user ? (
        <Link href="/settings" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#8b7cf6]/20 border border-[#8b7cf6]/30 flex items-center justify-center text-[#8b7cf6] text-xs">{user.givenName[0]}</div>
          <span className="text-xs text-[#888] hover:text-white transition-colors">{user.givenName}</span>
        </Link>
      ) : (
        <Link href={`/${lang}/auth`} className="text-xs text-[#555] hover:text-white transition-colors">Login</Link>
      )}
    </header>
  );
}