// index.ts
// ⚠️  Non modificare questo file — usa app/routes.ts per registrare le route
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { loadRoutes } from './src/core/loader'
import { routes } from './app/routes'
import { env } from './app/environment'

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }))

loadRoutes(app, routes)

app.listen({
  port: env.server.port,
  hostname: env.server.hostname,
})

console.log(
  `\x1b[32m✓\x1b[0m server online  ` +
  `\x1b[36mhttp://${app.server?.hostname}:${app.server?.port}\x1b[0m  ` +
  `\x1b[90m[${env.isProd ? 'production' : 'development'}]\x1b[0m`
)