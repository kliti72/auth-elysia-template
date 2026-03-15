const BASE = process.env.NEXT_PUBLIC_API_URL

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // manda i cookie automaticamente — sessionAccessToken
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}