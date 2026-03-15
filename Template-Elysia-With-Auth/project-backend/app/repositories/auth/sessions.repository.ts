import { db } from '../../../config/database'
import { sessions } from '../../../config/schema'
import type { Sessions, CreateSessionsDto } from '../../types/auth/sessions.types'
import { eq, desc } from 'drizzle-orm'

export function findAll(): Sessions[] {
  return db.select().from(sessions).orderBy(desc(sessions.createdAt)).all()
}

export function findById(id: string): Sessions | undefined {
  return db.select().from(sessions).where(eq(sessions.id, id)).get()
}

export function findByUserId(id: number): Sessions | undefined {
  return db.select().from(sessions).where(eq(sessions.userId, id)).get()
}

export function findByAccessToken(accessToken: string) : Sessions | undefined {
    return db.select().from(sessions).where(eq(sessions.accessToken, accessToken)).get()
}

export function insert(dto: CreateSessionsDto): Sessions {
  return db.insert(sessions).values(dto).returning().get()!
}

export function update(id: string, dto: Partial<CreateSessionsDto>): Sessions | undefined {
  console.log("Sessione aggiornata");
  return db.update(sessions).set(dto).where(eq(sessions.id, id)).returning().get()
}

export function remove(id: string): boolean {
  const result = db.delete(sessions).where(eq(sessions.id, id)).returning().get()
  return result != undefined;
}
