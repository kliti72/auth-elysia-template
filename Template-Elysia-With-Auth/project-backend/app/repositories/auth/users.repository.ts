import { db } from '../../../config/database'
import { users } from '../../../config/schema'
import type { Users, CreateUsersDto } from '../../types/auth/users.types'
import { eq, desc, and, sql } from 'drizzle-orm'
export function findAll(): Users[] {
  return db.select().from(users).orderBy(desc(users.createdAt)).all()
}

export function findById(id: number): Users | undefined {
  return db.select().from(users).where(eq(users.id, id)).get()
}

export function findByEmail(email: string): Users | undefined {
  return db.select().from(users).where(eq(users.email, email)).get()
}

export function insert(dto: CreateUsersDto): Users {
  return db.insert(users).values(dto).returning().get()!
}

export function update(id: number, dto: Partial<CreateUsersDto>): Users | undefined {
  return db.update(users).set(dto).where(eq(users.id, id)).returning().get()
}

export function remove(id: number): boolean {
  const result = db.delete(users).where(eq(users.id, id)).returning().get()
  return result != undefined;
}

export async function updateLocale(userId: number, locale: string) {
    return db.update(users)
      .set({ locale })
      .where(eq(users.id, userId))
      .returning()
      .get()
  }

export async function updateUserRole(email: string, role: 'user' | 'staff' | 'admin') {
  const user = await db.select().from(users).where(eq(users.email, email)).get()
  if (!user) throw new Error('User not found')
  
  return db.update(users)
    .set({ role })
    .where(eq(users.email, email))
}