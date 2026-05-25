import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { loadRoutes } from './app/config/loader'
import { routes } from './app/routes'
import { CONFIG } from './app/config/env'

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }))

loadRoutes(app, routes)

app.listen({
  port: CONFIG.server.port,
  hostname: CONFIG.server.hostname,
})
