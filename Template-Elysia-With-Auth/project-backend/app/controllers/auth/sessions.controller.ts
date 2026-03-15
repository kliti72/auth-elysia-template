// sessions.controller.ts

import { Elysia, t } from 'elysia'
import { sessionsService } from '../../services/auth/sessions.service'
import { usersService } from '../../services/auth/users.service'

export const sessionsController = new Elysia({ prefix: '/auth/session' })

  .get('/get', () => {
    return sessionsService.getAll()
  })

  .get('/', async ({ cookie, set }) => {
    const accessToken = cookie.sessionAccessToken.value

    if (!accessToken) {
      set.status = 401 
      return { error: 'No session cookie found' }
    }

    const session = await sessionsService.findByAccessToken(accessToken)

    if (!session || !session.isValid) {
      set.status = 401
      return { error: 'Session invalid or expired' }
    }

    if (new Date(session.expiresAt) < new Date()) {
      await sessionsService.invalidate(session.id)
      set.status = 401
      return { error: 'Session expired' }
    }

    const user = await usersService.getById(session.userId)

    if (!user) {
      set.status = 404
      return { error: 'User not found' }
    }

    return { user, accessToken: session.accessToken } // ← unica modifica
  }, {
    cookie: t.Cookie({
      sessionAccessToken: t.String()
    })
  })