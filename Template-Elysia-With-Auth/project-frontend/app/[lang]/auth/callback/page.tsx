"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/AuthContext";
import { CONFIG_APP } from "@/app/config/envorinemt";

export default function CallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    fetch(`${CONFIG_APP.HOST_API_URL}/auth/session`, { credentials: "include" })
      .then(res => {
            console.log("[Callback] status:", res.status);
        if (!res.ok) throw new Error("Errore /auth/session");
        return res.json();
      })
      .then(({ user }) => {
        if (!user) throw new Error("User mancante");
        setUser(user);
        router.replace("/me");
      })
      .catch(() => router.replace("/auth"));
  }, [mounted]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#8b7cf6] text-sm tracking-widest animate-pulse">
        Accesso in corso...
      </p>
    </div>
  );
}