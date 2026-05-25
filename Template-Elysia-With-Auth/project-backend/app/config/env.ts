
const IS_PROD = process.env.NODE_ENV === 'PRODUCTION'

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const CONFIG = {

  is_prod: IS_PROD, 
  host_url: optional('HOST_URL', 'http://0.0.0.0/'),
  app_url: optional('APP_URL', 'http://hokiapp.it/'),

  server: {
    port:      optional('PORT', '5000'),
    hostname: optional('HOST', '0.0.0.0'),
  },

  database: {
    schema: optional('SCEHMA_PATH', './database/schema.ts'),
    path: optional('PATH_DB', './config/storage/store.db'),
  },

}