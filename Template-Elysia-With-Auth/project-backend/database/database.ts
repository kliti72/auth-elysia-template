import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'
import { CONFIG } from '../app/config/env'

const sqlite = new Database(CONFIG.database.path, { create: true })

sqlite.run('PRAGMA journal_mode = WAL')
sqlite.run('PRAGMA foreign_keys = ON')

export const db = drizzle(sqlite, { schema })

// ─── Postgres (produzione) ────────────────────────────────────────────────────
// import { drizzle } from 'drizzle-orm/node-postgres'
// import { Pool } from 'pg'
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// export const db = drizzle(pool, { schema })