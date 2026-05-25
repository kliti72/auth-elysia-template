"use client";

import Link from "next/link";
import { getT } from "../i18n/translations";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useLang } from "../context/LangContext";


import { CONFIG_APP } from "@/app/config/envorinemt";
import { apiFetch } from "../services/api/fetch";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const lang = useLang();
  const tr = getT(lang);

  const user = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async () => {

    if (!email.trim()) return;
    setLoading(true);

    await apiFetch(`auth/magic/send`, {
      method: "POST",
      body: JSON.stringify({ email: email.trim() }),  
    });
    
    setSent(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
      window.location.href = `${CONFIG_APP.HOST_API_URL}/auth/google`;
  };

  useEffect(() => {
    if (user.status === 'authenticated') router.replace("/");
  }, [user]);

  return (
    <>
      <div className="">
        <div className="text-center mb-6 fu">
          <Link href={`/${lang}`} aria-label="Name-APP home">
            <h1 className="text-2xl tracking-[0.15em] text-white" >
              {tr.name_app}
            </h1>
          </Link>
        </div>

        {!sent ? (
          <>
            <p className="fu1 text-xs text-[#555] mb-5 leading-relaxed">{tr.auth_sub}</p>
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="fu1 w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-[#111] text-xs font-medium hover:bg-zinc-100 transition-all hover:scale-[1.02] mb-4 disabled:opacity-50"
            >
              {googleLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
                </svg>
              )}
              {tr.google}
            </button>

  
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
                ) : <> {tr.magic_cta}</>}
              </button>
              <p className="text-[10px] text-[#383838] text-center leading-relaxed">{tr.magic_hint}</p>
            </div>


            <p className="fu3 text-[9px] text-[#2e2e2e] text-center mt-5 leading-relaxed">
              {tr.terms_hint}{" "}
              <Link href={`/${lang}/terms`} className="text-[#3a3a3a] hover:text-white transition-colors">{tr.terms}</Link>
              {" "}{tr.and}{" "}
              <Link href={`/${lang}/privacy`} className="text-[#3a3a3a] hover:text-white transition-colors">{tr.privacy}</Link>.
            </p>
          </>
        ) : (
     
          <div className="text-center flex flex-col items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#4ade80] flex items-center justify-center text-xl">
              ✉
            </div>
            <div>
              <h2 className="text-lg text-white mb-1" >
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
    </>
  );
}