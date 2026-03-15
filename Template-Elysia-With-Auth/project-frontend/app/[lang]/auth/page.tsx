"use client";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { getT } from "../i18n/translations";
import { useLang } from "../context/LangContext";

/* ─── TYPES ──────────────────────────────────────────────── */
interface AuthPageProps {
  lang?: string;
  callbackUrl?: string;
}


/* ─── PAGE ───────────────────────────────────────────────── */
export default function AuthPage({ callbackUrl = "/" }: AuthPageProps) {
  const lang = useLang();
  const tr = getT(lang);
    
  const { loginWithGoogle } = useAuth();

  const [email,         setEmail]         = useState("");
  const [sent,          setSent]          = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState("");
 
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  /* ── MAGIC LINK ── */
  const handleMagicLink = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/magic/send`, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body:        JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Errore invio");
      }

      setSent(true);
    } catch (e) {
      console.error("[magic link]", e);
    } finally {
      setLoading(false);
    }
  };

  /* ── GOOGLE ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:0.1; }
          50%      { opacity:0.8; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu  { animation: fadeUp 0.5s ease forwards; }
        .fu1 { animation: fadeUp 0.5s 0.08s ease forwards; opacity:0; }
        .fu2 { animation: fadeUp 0.5s 0.16s ease forwards; opacity:0; }
        .fu3 { animation: fadeUp 0.5s 0.24s ease forwards; opacity:0; }
        .inp {
          background:#111; border:1px solid rgba(255,255,255,0.07);
          border-radius:10px; padding:11px 14px; color:white;
          font-size:13px; width:100%; outline:none;
          transition:border-color 0.2s;
        }
        .inp:focus  { border-color:rgba(139,124,246,0.5); }
        .inp.error  { border-color:rgba(255,80,80,0.4); }
        .inp::placeholder { color:#3a3a3a; }
      `}</style>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">

        {/* BACK */}
        <Link
          href={`/${lang}`}
          className="fu absolute top-6 left-6 text-[10px] text-[#2a2a2a] hover:text-white transition-colors tracking-widest uppercase z-10"
        >
          {tr.back}
        </Link>

        <div className="relative z-10 w-full max-w-[320px]">
          <div className="bg-[#111]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">

            {/* LOGO */}
            <div className="text-center mb-6 fu">
              <Link href={`/${lang}`} aria-label="Versify home">
                <h1 className="text-2xl font-normal tracking-[0.15em] text-white" style={{ fontFamily: "Georgia,serif" }}>
                  Versify
                </h1>
              </Link>
              <p className="text-[9px] tracking-[0.3em] text-[#8b7cf6] uppercase mt-0.5">
                {tr.auth_tagline}
              </p>
            </div>

            {!sent ? (
              <>
                <p className="fu1 text-xs text-[#555] mb-5 leading-relaxed">{tr.auth_sub}</p>

                {/* GOOGLE */}
                <button
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="fu1 w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-[#111] text-xs font-medium hover:bg-zinc-100 transition-all hover:scale-[1.02] mb-4 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                  )}
                  {tr.google}
                </button>

                {/* DIVIDER */}
                <div className="fu2 flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-[#383838] tracking-widest uppercase">{tr.or}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* MAGIC LINK */}
                <div className="fu2 flex flex-col gap-2.5">
                  <label htmlFor="email" className="sr-only">{tr.email}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                    placeholder={tr.email}
                    className={`inp ${error ? "error" : ""}`}
                    autoComplete="email"
                    aria-required="true"
                    disabled={loading}
                  />

                  {/* ERROR */}
                  {error && (
                    <p className="text-[10px] text-red-400/70 leading-relaxed">{error}</p>
                  )}

                  <button
                    onClick={handleMagicLink}
                    disabled={!email.trim() || loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-[11px] tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : <>✦ {tr.magic_cta}</>}
                  </button>
                  <p className="text-[10px] text-[#383838] text-center leading-relaxed">{tr.magic_hint}</p>
                </div>

                {/* TERMS */}
                <p className="fu3 text-[9px] text-[#2e2e2e] text-center mt-5 leading-relaxed">
                  {tr.terms_hint}{" "}
                  <Link href={`/${lang}/terms`} className="text-[#3a3a3a] hover:text-white transition-colors">{tr.terms}</Link>
                  {" "}{tr.and}{" "}
                  <Link href={`/${lang}/privacy`} className="text-[#3a3a3a] hover:text-white transition-colors">{tr.privacy}</Link>.
                </p>
              </>
            ) : (
              /* SENT STATE */
              <div className="text-center flex flex-col items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#4ade80] flex items-center justify-center text-xl">
                  ✉
                </div>
                <div>
                  <h2 className="text-lg text-white font-normal mb-1" style={{ fontFamily: "Georgia,serif" }}>
                    {tr.sent_title}
                  </h2>
                  <p className="text-xs text-[#555]">
                    {tr.sent_sub} <span className="text-[#8b7cf6]">{email}</span>
                  </p>
                </div>
                <p className="text-[11px] text-[#444] leading-relaxed">{tr.sent_hint}</p>
                <button
                  onClick={() => { setSent(false); setEmail(""); setError(""); }}
                  className="text-[11px] text-[#555] hover:text-white transition-colors"
                >
                  {tr.resend}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}