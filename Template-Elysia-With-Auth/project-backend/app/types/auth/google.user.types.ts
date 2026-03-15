import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users } from '../../../config/schema'

export interface GoogleUserRaw {
  id: number,
  idGoogle: string,
  session_id: string,
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  local: string
}

export type Users = InferSelectModel<typeof users>
export type CreateGoogleuserDto = InferInsertModel<typeof users>

export function fromGoogleResponse(raw: GoogleUserRaw): Omit<Users, 'id' | 'createdAt' | 'password'> {
  return {
  email: raw.email,
  verifiedEmail: raw.verified_email,
  name: raw.name,
  givenName: raw.given_name,
  familyName: raw.family_name,
  picture: raw.picture,
  locale: raw.local ?? 'en',
  bio: '',
  handle: null,
  role: 'user'
}
}
