// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function CallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Fix hydration: aspetta che siamo lato client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("[Callback] 🚀 Avvio fetch sessione...");
    console.log("[Callback] 🌐 API URL →", API);

    fetch(`${API}/auth/session`, { credentials: "include" })
      .then(res => {
        console.log("[Callback] 📡 Response status →", res.status);

        if (!res.ok) {
          console.error("[Callback] ❌ Session non valida — status:", res.status);
          throw new Error("Session non valida");
        }
        return res.json();
      })
      .then(data => {
        console.log("[Callback] ✅ Data ricevuta →", data);

        const { user, accessToken } = data;

        if (!user) {
          console.error("[Callback] ❌ User mancante nel payload");
          throw new Error("User mancante");
        }

        if (!accessToken) {
          console.warn("[Callback] ⚠️ accessToken mancante — controlla il backend");
        }

        console.log("[Callback] 👤 User →", user);
        console.log("[Callback] 🔑 AccessToken →", accessToken ? "presente" : "MANCANTE");

        setUser(user, accessToken);

        console.log("[Callback] ➡️ Redirect verso /me");
        router.replace("/me");
      })
      .catch(err => {
        console.error("[Callback] 💥 Errore catch →", err.message);
        console.warn("[Callback] ↩️ Redirect verso /auth");
        router.replace("/auth");
      });
  }, [mounted]);

  // Evita mismatch SSR/client — render vuoto finché non siamo montati
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#8b7cf6] text-sm tracking-widest animate-pulse">
        Accesso in corso...
      </p>
    </div>
  );
}