"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { getT } from "../i18n/translations";

export default function Header() {
  const lang = useLang();
  const tr = getT(lang);
  const { user, status } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${lang}`, label: "Home" },
    { href: `/${lang}/promo`, label: "Not Found" },
    { href: `/${lang}/admin`, label: "Amministrazione" },
  ];

  return (
    <header className="w-full px-5 py-5 border-b border-white/5 relative">
      <div className="flex items-center justify-between">
        <Link href={`/${lang}`} className="text-white tracking-[0.15em] text-sm">{tr.app_name}</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-[#555]">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* User / Login */}
          {status === "authenticated" && user ? (
            <Link href="/settings" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8b7cf6]/20 border border-[#8b7cf6]/30 flex items-center justify-center text-[#8b7cf6] text-xs">{user.givenName[0]}</div>
              <span className="text-xs text-[#888] hover:text-white transition-colors hidden md:block">{user.givenName}</span>
            </Link>
          ) : (
            <Link href={`/${lang}/auth`} className="text-xs text-[#555] hover:text-white transition-colors">{tr.login ?? "Login"}</Link>
          )}

          {/* Hamburger — mobile only */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden flex flex-col gap-[5px] p-1 group" aria-label="Menu">
            <span className={`block h-px w-5 bg-[#555] transition-all duration-200 origin-center group-hover:bg-white ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px bg-[#555] transition-all duration-200 group-hover:bg-white ${open ? "w-0 opacity-0" : "w-5"}`} />
            <span className={`block h-px w-5 bg-[#555] transition-all duration-200 origin-center group-hover:bg-white ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col pt-4 pb-2 gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-xs text-[#555] hover:text-white transition-colors py-2 border-b border-white/5 last:border-0">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}