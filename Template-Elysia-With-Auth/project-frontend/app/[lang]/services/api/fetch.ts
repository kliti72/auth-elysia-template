import { CONFIG_APP } from "@/app/config/envorinemt"

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${CONFIG_APP.HOST_API_URL}/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}