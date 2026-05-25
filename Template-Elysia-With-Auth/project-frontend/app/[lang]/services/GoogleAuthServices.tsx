
import { CONFIG_APP } from "@/app/config/envorinemt";

export const GoogleAuthService = {
  login(): void {
    window.location.href = `${CONFIG_APP.HOST_API_URL}/auth/google`;
  },
};