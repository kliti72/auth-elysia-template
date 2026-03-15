import { eq } from 'drizzle-orm'
import { magicLinks } from '../../../config/schema'
import { db } from '../../../config/database'
import type { CreateMagiLinkDto, MagicLink } from '../../types/auth/magic.type'

export const magicLinksRepository = {
  insert(dto: CreateMagiLinkDto): MagicLink {
    return db.insert(magicLinks).values(dto).returning().get()
  },
 
  getByToken(token: string): MagicLink | undefined {
    return db.select().from(magicLinks).where(eq(magicLinks.token, token)).get()
  },

  markAsUsed(id: string): void {
    db.update(magicLinks).set({ used: true }).where(eq(magicLinks.id, id)).run()
  },
}
