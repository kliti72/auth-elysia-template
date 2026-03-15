import { eq, desc } from 'drizzle-orm'
import { db } from '../../../config/database'
import { poems, users } from '../../../config/schema'

export const adminRepository = {

  // tutti i poemi con join autore
  findAllPoems: async () => {
    const rows = await db
      .select({
        id:         poems.id,
        title:      poems.title,
        slug:       poems.slug,
        status:     poems.status,
        viewCount:  poems.viewCount,
        likesCount: poems.likesCount,
        createdAt:  poems.createdAt,
        user: {
          id:     users.id,
          name:   users.name,
          email:  users.email,
          handle: users.handle,
        },
      })
      .from(poems)
      .innerJoin(users, eq(poems.userId, users.id))
      .orderBy(desc(poems.createdAt))

    return rows
  },

  // tutti gli utenti
  findAllUsers: async () => {
    return db
      .select({
        id:            users.id,
        name:          users.name,
        email:         users.email,
        handle:        users.handle,
        role:          users.role,
        createdAt:     users.createdAt,
        isAnonymous:   users.isAnonymous,
        verifiedEmail: users.verifiedEmail,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
  },

  // find user by id — usato dal middleware
  findUserById: async (id: number) => {
    return db.select().from(users).where(eq(users.id, id)).get()
  },

  // aggiorna ruolo
  updateUserRole: async (email: string, role: 'user' | 'staff' | 'admin') => {
    const user = await db.select().from(users).where(eq(users.email, email)).get()
    if (!user) throw new Error('User not found')

    return db
      .update(users)
      .set({ role })
      .where(eq(users.email, email))
      .returning()
      .get()
  },
}