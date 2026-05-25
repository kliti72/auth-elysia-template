import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { magicLinks } from '../../../database/schema'

export type MagicLink = InferSelectModel<typeof magicLinks>
export type CreateMagiLinkDto = InferInsertModel<typeof magicLinks>
