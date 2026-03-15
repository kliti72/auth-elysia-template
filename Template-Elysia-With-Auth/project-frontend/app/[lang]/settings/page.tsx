
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/AuthContext";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/* ─── ANONYMOUS DROPDOWN ─────────────────────────────────── */
function AnonymousToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-[#555] tracking-widest uppercase">
        Visibilità profilo
      </label>

      <div ref={ref} className="relative">
        {/* TRIGGER */}
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left"
          style={{
            background: "rgba(17,17,17,0.8)",
            borderColor: open
              ? "rgba(139,124,246,0.5)"
              : value
                ? "rgba(255,100,100,0.2)"
                : "rgba(74,222,128,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-base">{value ? "🎭" : "✦"}</span>
            <div>
              <p className="text-xs text-white">
                {value ? "Profilo Anonimo" : "Profilo Pubblico"}
              </p>
              <p className="text-[10px] mt-0.5" style={{
                color: value ? "rgba(255,100,100,0.7)" : "rgba(74,222,128,0.7)"
              }}>
                {value
                  ? "il tuo nome è nascosto in tutta la piattaforma"
                  : "il tuo nome è visibile nella silloge e sui profili"}
              </p>
            </div>
          </div>
          <span className="text-[#333] text-[10px]">{open ? "▴" : "▾"}</span>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute top-full mt-1 left-0 right-0 rounded-xl border border-white/[0.07] bg-[#111]/98 backdrop-blur-xl overflow-hidden z-50">

            {/* opzione pubblica */}
            <button
              onClick={() => { onChange(false); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-base">✦</span>
              <div className="flex-1">
                <p className="text-xs text-white">Profilo Pubblico</p>
                <p className="text-[10px] text-[#444] mt-0.5">
                  nome e avatar visibili nella silloge e sui tuoi scritti
                </p>
              </div>
              {!value && <span className="text-[#4ade80] text-[10px]">✓</span>}
            </button>

            {/* opzione anonima */}
            <button
              onClick={() => { onChange(true); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
            >
              <span className="text-base">🎭</span>
              <div className="flex-1">
                <p className="text-xs text-white">Profilo Anonimo</p>
                <p className="text-[10px] text-[#444] mt-0.5">
                  le tue poesie appaiono senza nome — resti nell'ombra
                </p>
              </div>
              {value && <span className="text-[#8b7cf6] text-[10px]">✓</span>}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────── */
export default function EditProfilePage() {
  const { user, setUser, status, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [bio, setBio] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/auth"); return; }
    if (user) {
      setName(user.name);
      setGivenName(user.givenName);
      setBio(user.bio ?? "");
      setIsAnonymous(user.isAnonymous ?? false);
    }
  }, [user, status]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`${API}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, givenName, bio, isAnonymous }),
      });
      if (!res.ok) throw new Error("Errore salvataggio");
      const updated = await res.json();
      const token = localStorage.getItem("versify_access_token")!;
      setUser(updated, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Qualcosa è andato storto, riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-[#8b7cf6] animate-pulse">✦</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu { animation: fadeUp 0.4s ease forwards; }
        .inp {
          background:#111; border:1px solid rgba(255,255,255,0.07);
          border-radius:10px; padding:11px 14px; color:white;
          font-size:13px; width:100%; outline:none;
          transition:border-color 0.2s;
        }
        .inp:focus { border-color:rgba(139,124,246,0.5); }
        .inp::placeholder { color:#3a3a3a; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a]/75 flex flex-col items-center justify-center px-4 py-16">


        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 text-[11px] text-[#444] hover:text-white transition-colors tracking-widest uppercase"
        >
          ← indietro
        </button>

        <div className="w-full max-w-sm fu">

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl text-white font-normal tracking-wide" style={{ fontFamily: "Georgia,serif" }}>
              Il tuo profilo
            </h1>
            <p className="text-xs text-[#555] mt-1">{user?.email}</p>
          </div>
            <Link href={"/blog"}>
                <button
                  className="mt-2 mb-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-[11px] tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  ✦ Vai al blog
                </button>
                </Link>
          {(user.role === "staff" || user.role === "admin") ? (
            <div>
              <Link href={"/admin"}>
                <button
                  className="mt-2 mb-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-[11px] tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  ✦ Apri Admin Dashboard
                </button>
              </Link>
  
              <Link href={"/blog/write"}>
                <button
                  className="mt-2 mb-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-[11px] tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  ✦ Crea un articolo per il blog
                </button>
              </Link>
            </div>
          ) : ""}

          {/* CARD */}
          <div className="bg-[#111]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#555] tracking-widest uppercase">Nome completo</label>
              <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#555] tracking-widest uppercase">Nome</label>
              <input className="inp" value={givenName} onChange={e => setGivenName(e.target.value)} placeholder="Nome" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#555] tracking-widest uppercase">Bio</label>
              <textarea
                className="inp"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Raccontati in poche parole..."
                rows={3}
                maxLength={300}
                style={{ resize: "none" }}
              />
              <p className="text-[9px] text-[#2a2a2a] text-right">{bio.length}/300</p>
            </div>

            {/* ANONYMOUS TOGGLE */}
            <AnonymousToggle value={isAnonymous} onChange={setIsAnonymous} />

            {/* FEEDBACK */}
            {saved && <p className="text-[11px] text-[#4ade80] text-center">✓ Profilo aggiornato</p>}
            {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loading || !name.trim() || !givenName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-[11px] tracking-widest uppercase hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "✦ Salva modifiche"
              }
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-full border border-white/10 text-[#555] text-xs tracking-widest uppercase hover:text-white hover:border-white/30 transition-all duration-300"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </>
  );
}