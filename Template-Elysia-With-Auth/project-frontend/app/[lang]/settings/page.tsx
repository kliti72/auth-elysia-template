"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/AuthContext";
import { apiFetch } from "../services/api/fetch";
import { User } from "../types/auth";

function AnonymousToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <div ref={ref} className="relative">
      
        {open && (
          <div className="absolute top-full mt-1 left-0 right-0 rounded-xl border border-white/[0.07] bg-[#111]/98 overflow-hidden z-50">
            {[{ label: "Pubblico", icon: "✦", v: false, color: "#4ade80" }, { label: "Anonimo", icon: "🎭", v: true, color: "#8b7cf6" }].map(opt => (
              <button key={opt.label} onClick={() => { onChange(opt.v); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.03] border-b border-white/[0.04] last:border-0">
                <span>{opt.icon}</span>
                <p className="text-xs text-white flex-1">{opt.label}</p>
                {value === opt.v && <span className="text-[10px]" style={{ color: opt.color }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser, status } = useAuth();
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
    if (user) { setName(user.name); setGivenName(user.givenName); setBio(user.bio ?? ""); }
  }, [user, status]);

  const handleSave = async () => {
    setLoading(true); setError(null);
    try {
      const updated = await apiFetch("users/me", { method: "PATCH", body: JSON.stringify({ name, givenName, bio, isAnonymous }) });
      setUser(updated as User); setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch { setError("Qualcosa è andato storto, riprova."); }
    finally { setLoading(false); }
  };

  if (status === "loading" || status === "unauthenticated") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <span className="text-[#8b7cf6] animate-pulse">✦</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]/75 flex flex-col items-center justify-center px-4 py-16">
      <button onClick={() => router.back()} className="absolute top-5 left-5 text-[11px] text-[#444] hover:text-white transition-colors tracking-widest uppercase">← indietro</button>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl text-white font-normal tracking-wide" style={{ fontFamily: "Georgia,serif" }}>Impostazioni</h1>
          <p className="text-xs text-[#555] mt-1">{user?.email}</p>
        </div>
        <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
          {[{ label: "Nome completo", value: name, set: setName, placeholder: "Nome completo" }, { label: "Nome", value: givenName, set: setGivenName, placeholder: "Nome" }].map(f => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#555] tracking-widest uppercase">{f.label}</label>
              <input className="inp" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#555] tracking-widest uppercase">Bio</label>
            <textarea className="inp" value={bio} onChange={e => setBio(e.target.value)} placeholder="Raccontati in poche parole..." rows={3} maxLength={300} style={{ resize: "none" }} />
            <p className="text-[9px] text-[#2a2a2a] text-right">{bio.length}/300</p>
          </div>
          <AnonymousToggle value={isAnonymous} onChange={setIsAnonymous} />
          {saved && <p className="text-[11px] text-[#4ade80] text-center">✓ Profilo aggiornato</p>}
          {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}
          <button onClick={handleSave} disabled={loading || !name.trim() || !givenName.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r text-white text-[11px] tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center">
            {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Salva modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}