// src/middleware/logger.ts
import { Elysia } from 'elysia'

export const loggerMiddleware = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${new URL(request.url).pathname}`)
  })