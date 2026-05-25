"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthContextValue, AuthState, User } from "../types/auth";

import { CONFIG_APP } from "@/app/config/envorinemt";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
    error: null,
  });

  useEffect(() => {
    fetch(`${CONFIG_APP.HOST_API_URL}/auth/session`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(({ user }) => {
        setState({ status: "authenticated", user, error: null })
      })
      .catch(() => {
        setState({ status: "unauthenticated", user: null, error: null })
      })
  }, [])

  const setUser = useCallback((user: User): void => {
    setState({ status: "authenticated", user, error: null });
  }, []);

  const logout = useCallback((): void => {
    setState({ status: "unauthenticated", user: null, error: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}