
const IS_PROD = process.env.NODE_ENV === 'PRODUCTION'

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const CONFIG = {

  APP_NAME: optional('APP_NAME', 'APP-NAME'),
  is_prod: IS_PROD, 
  host_url: optional('HOST_URL', 'http://0.0.0.0/'),
  app_url: optional('APP_URL', 'http://hokiapp.it/'),
  SMTP_HOST: optional('SMTP_HOST', 'ssl0.ovh.net'),
  SMTP_PORT: optional('SMTP_PORT', '587'),
  SMTP_USER: optional('SMTP_USER', 'noreply@versify.art'),
  SMTP_PASS: optional('SMTP_PASS', '******************'),
  SMTP_FROM: optional('SMTP_FROM', 'noreply@versify.art'),

  server: {
    port:      optional('PORT', '5000'),
    hostname: optional('HOST', '0.0.0.0'),
  },

  database: {
    schema: optional('SCEHMA_PATH', './database/schema.ts'),
    path: optional('PATH_DB', './config/storage/store.db'),
  },

}