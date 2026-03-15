// src/modules/auth/verify-email.controller.ts
import { Elysia, t } from 'elysia'
import { magicLinksService } from '../../services/auth/magic.service'
import { sessionsService } from '../../services/auth/sessions.service'
import { usersService } from '../../services/auth/users.service'

export const VerifyEmailController = new Elysia({ prefix: '/auth/email' })

  // Manda email di verifica — utente già loggato
  .post('/send-verification', async ({ cookie, set }) => {
    const accessToken = cookie.sessionAccessToken.value
    if (!accessToken) { set.status = 401; return { error: 'Non autenticato' } }

    const session = await sessionsService.findByAccessToken(accessToken)
    if (!session) { set.status = 401; return { error: 'Sessione non valida' } }

    const user = await usersService.getById(session.userId)
    if (!user) { set.status = 404; return { error: 'Utente non trovato' } }
    if (user.verifiedEmail) return { success: true, message: 'Email già verificata' }

    await magicLinksService.send(user.email, 'verify-email')
    console.log("[VerifyEmail] Email di verifica mandata a:", user.email)
    return { success: true, message: 'Email di verifica inviata' }
  }, {
    cookie: t.Cookie({ sessionAccessToken: t.String() })
  })

  // Verifica token dal link nell'email
  .get('/verify', async ({ query, set }) => {
    const { token } = query
    if (!token) { set.status = 400; return { error: 'Token mancante' } }

    const email = await magicLinksService.verify(token)
    const user = await usersService.getByEmail(email)
    if (!user) { set.status = 404; return { error: 'Utente non trovato' } }

    await usersService.verifyEmail(user.id)
    console.log("[VerifyEmail] Email verificata per:", user.email)

    return new Response(null, {
      status: 302,
      headers: { "Location": `${Bun.env.APP_URL}/me?verified=true` }
    })
  }, {
    query: t.Object({ token: t.String() })
  })