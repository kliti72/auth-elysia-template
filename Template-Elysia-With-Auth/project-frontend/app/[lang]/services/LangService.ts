import { apiFetch } from "./api/fetch";

export const LangService = {
  updateLocale: (locale: string) =>
    apiFetch<{ locale: string }>('/lang', {
      method: 'PATCH',
      body: JSON.stringify({ locale }),
    }),
}