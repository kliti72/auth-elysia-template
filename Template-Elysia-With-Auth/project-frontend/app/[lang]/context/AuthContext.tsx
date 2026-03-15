// lib/auth/AuthContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { GoogleAuthService } from "../services/GoogleAuthServices";
import type { AuthContextValue, AuthState, User } from "../types/auth";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "versify_access_token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading", // loading finché non controlliamo il token salvato
    user: null,
    error: null,
  });

  /* ── REIDRATA AL MOUNT ── */
useEffect(() => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    setState({ status: "unauthenticated", user: null, error: null });
    return;
  }

  // il cookie httpOnly viene mandato automaticamente — credentials: include
  fetch(`${API}/auth/session`, {
    credentials: "include", // ← solo questo, niente Authorization header
  })
    .then(res => {
      if (!res.ok) throw new Error("Session non valida");
      return res.json();
    })
    .then(({ user, accessToken }) => { // ← destruttura correttamente
      console.log("[AuthContext] Reidratato →", user);
      setState({ status: "authenticated", user, error: null });
      localStorage.setItem(TOKEN_KEY, accessToken); // aggiorna token
    })
    .catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      setState({ status: "unauthenticated", user: null, error: null });
    });
}, []);

  /* ── GOOGLE LOGIN ── */
  const loginWithGoogle = useCallback((): void => {
    GoogleAuthService.login();
  }, []);

  /* ── SET USER + SALVA TOKEN ── */
  const setUser = useCallback((user: User, accessToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    setState({ status: "authenticated", user, error: null });
  }, []);

  /* ── LOGOUT ── */
  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ status: "unauthenticated", user: null, error: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loginWithGoogle, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}