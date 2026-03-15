// src/modules/auth/magic.controller.ts
import { Elysia, t } from 'elysia'
import { magicLinksService } from '../../services/auth/magic.service'
import { sessionsService } from '../../services/auth/sessions.service'
import { usersService } from '../../services/auth/users.service'

export const MagicAuthController = new Elysia({ prefix: '/auth/magic' })

  .post('/send', async ({ body }) => {
    const { email } = body
    await magicLinksService.send(email)
    // Risposta vaga per sicurezza — non riveli se l'email esiste o no
    return { success: true, message: 'Se la mail esiste, riceverai il link' }
  }, {
    body: t.Object({ email: t.String({ format: 'email' }) })
  })

  .get('/verify', async ({ query, set }) => {
    const { token } = query
    if (!token) { set.status = 400; return { error: 'Token mancante' } }

    const email = await magicLinksService.verify(token)

    let user = await usersService.getByEmail(email)
    if (!user) {
      user = await usersService.createFromEmail(email)
    }

    const session = await sessionsService.createMagicLinkSession(user)

    // stesso pattern Google — cookie + redirect alla callback page
    return new Response(null, {
      status: 302,
      headers: {
        "Location": `${Bun.env.APP_URL}/auth/callback`,
        "Set-Cookie": `sessionAccessToken=${session.accessToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
      }
    })
  }, {
    query: t.Object({ token: t.String() })
  })