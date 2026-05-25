import { db } from '../../../database/database'
import { users } from '../../../database/schema'
import type { Users, CreateUsersDto } from '../../types/auth/users.types'
import { eq, desc, } from 'drizzle-orm'

export const userRepository = {
  findAll(): Users[] {
    return db.select().from(users).orderBy(desc(users.createdAt)).all()
  },

  findById(id: number): Users | undefined {
    return db.select().from(users).where(eq(users.id, id)).get()
  },

  findByEmail(email: string): Users | undefined {
    return db.select().from(users).where(eq(users.email, email)).get()
  },

  insert(dto: CreateUsersDto): Users {
    return db.insert(users).values(dto).returning().get()!
  },

  update(id: number, dto: Partial<CreateUsersDto>): Users | undefined {
    return db.update(users).set(dto).where(eq(users.id, id)).returning().get()
  },

  remove(id: number): boolean {
    const result = db.delete(users).where(eq(users.id, id)).returning().get()
    return result != undefined;
  },

  updateUserRole(email: string, role: 'user' | 'staff' | 'admin') {
    const user = db.select().from(users).where(eq(users.email, email)).get()
    if (!user) throw new Error('User not found')

    return db.update(users)
      .set({ role })
      .where(eq(users.email, email))
  },

}