import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users } from '../../../database/schema'

export type Users          = InferSelectModel<typeof users>
export type CreateUsersDto = InferInsertModel<typeof users>
