import { defineConfig } from 'drizzle-kit'
import { CONFIG } from './app/config/env'

export default defineConfig({
  schema: CONFIG.database.schema,
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: CONFIG.database.path,
  },
})