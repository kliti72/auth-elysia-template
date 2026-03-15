import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { sessions } from '../../../config/schema'

export type Sessions          = InferSelectModel<typeof sessions>
export type CreateSessionsDto = InferInsertModel<typeof sessions>
