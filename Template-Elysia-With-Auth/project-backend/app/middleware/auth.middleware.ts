import Elysia from 'elysia'
import { sessionsService } from '../services/auth/sessions.service'
import { usersService } from '../services/auth/users.service'

export const authMiddleware = new Elysia({ name: 'auth' })
  .derive({ as: 'scoped' }, async ({ cookie, set }) => {
    
    // stessa logica del tuo sessionsController — coerente frat
    const accessToken = cookie.sessionAccessToken?.value as string | undefined

    if (!accessToken) {
      set.status = 401
      throw new Error('No session cookie found')
    }

    const session = await sessionsService.findByAccessToken(accessToken)

    if (!session || !session.isValid) {
      set.status = 401
      throw new Error('Session invalid or expired')
    }

    if (new Date(session.expiresAt) < new Date()) {
      await sessionsService.invalidate(session.id)
      set.status = 401
      throw new Error('Session expired')
    }

    const user = await usersService.getById(session.userId)

    if (!user) {
      set.status = 404
      throw new Error('User not found')
    }

    return { userId: user.id, user }
  })