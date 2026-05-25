import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { sessions } from '../../../database/schema'

export type Sessions          = InferSelectModel<typeof sessions>
export type CreateSessionsDto = InferInsertModel<typeof sessions>
