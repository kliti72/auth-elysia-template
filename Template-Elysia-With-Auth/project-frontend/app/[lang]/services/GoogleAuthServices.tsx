// lib/services/GoogleAuthService.ts


const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const GoogleAuthService = {
  /** Redirecta il browser al backend — Google fa il resto */
  login(): void {
    window.location.href = `${API}/auth/google`;
  },
};