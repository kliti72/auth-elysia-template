import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './config/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_PATH ?? './config/database/app.db',
  },
})