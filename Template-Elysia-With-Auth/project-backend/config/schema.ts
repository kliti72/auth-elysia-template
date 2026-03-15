// NOT EDIT MUCH THIS FILE, USE ONLY WITH Elysia-cli
// https://github.com/kliti72/elysia-cli

import { sqliteTable, integer, text, check } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password'),
  verifiedEmail: integer('verified_email', { mode: 'boolean' }).notNull().default(false),
  name: text('name').notNull(),
  givenName: text('given_name').notNull(),
  familyName: text('family_name').notNull(),
  picture: text('picture').notNull(),
  locale: text('locale').notNull(),
  handle: text('handle').unique(),
  bio: text('bio'),
  role: text('role', { enum: ['user', 'staff', 'admin'] }).notNull().default('user'), 
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => [
  check('bio_length', sql`length(${table.bio}) <= 300`),
])

export const magicLinks = sqliteTable('magic_links', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// ═══════════════════════════════════
// sessions
// ═══════════════════════════════════
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  isValid: integer('is_valid', { mode: 'boolean' }).notNull().default(true),
})

// Relations — drizzle le vuole esplicite frat
export const usersRelations = relations(users, ({ many }) => ({
  sessions:    many(sessions),
}))


export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))




