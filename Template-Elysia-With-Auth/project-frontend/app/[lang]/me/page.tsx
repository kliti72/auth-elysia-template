"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

/* ─── PAGE ───────────────────────────────────────────────── */
export default function MePage() {
  const router = useRouter();
  const { status, user } = useAuth();

  // guard — redirect se non autenticato
  if (status === "unauthenticated") { router.replace("/auth"); return null; }
  if (status === "loading") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <span className="text-[#8b7cf6] text-sm tracking-widest animate-pulse">✦</span>
    </div>
  );

  // da qui status === "authenticated" — user è sempre User, mai null
  const lang = useLang();

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .poem-card, .collection-card { animation: fadeUp 0.5s ease forwards; opacity: 0; }
      `}</style>

      <div className="min-h-screen  bg-[#0a0a0a]/75">
        <main className="max-w-5xl mx-auto px-4 py-8">

          {/* ── PROFILO ── */}
          <section className="mb-12">
            <div className="flex items-start gap-5 mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl text-[#8b7cf6]"
                style={{ background: "rgba(139,124,246,0.1)", border: "1px solid rgba(139,124,246,0.2)" }}
              >
                {user.givenName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-xl text-white font-normal mb-1" style={{ fontFamily: "Georgia, serif" }}>
                  {user.givenName}
                </h1>
                <p className="text-sm text-[#555]">{user.email}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}