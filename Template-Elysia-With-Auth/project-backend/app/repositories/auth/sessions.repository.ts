import { db } from '../../../database/database'
import { sessions } from '../../../database/schema'
import type { Sessions, CreateSessionsDto } from '../../types/auth/sessions.types'
import { eq, desc } from 'drizzle-orm'

export const sessionsRepository = {

  findAll(): Sessions[] {
    return db.select().from(sessions).orderBy(desc(sessions.createdAt)).all()
  },

  findById(id: string): Sessions | undefined {
    return db.select().from(sessions).where(eq(sessions.id, id)).get()
  },

  findByUserId(id: number): Sessions | undefined {
    return db.select().from(sessions).where(eq(sessions.userId, id)).get()
  },

  findByAccessToken(accessToken: string): Sessions | undefined {
    return db.select().from(sessions).where(eq(sessions.accessToken, accessToken)).get()
  },

  insert(dto: CreateSessionsDto): Sessions {
    return db.insert(sessions).values(dto).returning().get()!
  },

  update(id: string, dto: Partial<CreateSessionsDto>): Sessions | undefined {
    console.log("Sessione aggiornata");
    return db.update(sessions).set(dto).where(eq(sessions.id, id)).returning().get()
  },

  remove(id: string): boolean {
    const result = db.delete(sessions).where(eq(sessions.id, id)).returning().get()
    return result != undefined;
  },

}