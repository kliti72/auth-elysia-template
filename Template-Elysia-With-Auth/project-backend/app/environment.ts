const isProd = process.env.NODE_ENV === 'production'

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const env = {
  isProd,
  isDev: !isProd,

  server: {
    port:     isProd ? Number(optional('PORT', '5000')) : Number(optional('PORT', '3000')),
    hostname: isProd ? '0.0.0.0' : 'localhost',
  },

  db: {
    path: optional('DB_PATH', './config/database/app.db'),
  },
}