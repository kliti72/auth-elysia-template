import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export interface AdminUser {
  id: number
  name: string
  email: string
  handle: string | null
  role: string
  createdAt: string
  isAnonymous: boolean
  verifiedEmail: boolean
}


export const adminKeys = {
  users: ['admin', 'users'] as const,
}

// ═══════════════════════════════════
// ADMIN — GET ALL USERS
// ═══════════════════════════════════

export const useAdminUsers = () =>
  useQuery({
    queryKey: adminKeys.users,
    queryFn: async (): Promise<AdminUser[]> => {
      const res = await fetch(`${API}/admin/users`, { credentials: 'include' })
      if (!res.ok) throw new Error('Errore nel fetch utenti admin')
      return res.json()
    },
  })

// ═══════════════════════════════════
// ADMIN — UPDATE USER ROLE
// ═══════════════════════════════════

export const useUpdateUserRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'user' | 'staff' | 'admin' }) => {
      const res = await fetch(`${API}/admin/users/role`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      if (!res.ok) throw new Error('Errore aggiornamento ruolo')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.users }),
  })
}