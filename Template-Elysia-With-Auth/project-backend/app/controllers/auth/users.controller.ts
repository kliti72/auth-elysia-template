import { Elysia, t } from 'elysia'
import { sessionsService } from '../../services/auth/sessions.service'
import { usersService } from '../../services/auth/users.service'

export const usersController = new Elysia({ prefix: '/users' })

  .get('/', () => {
    return usersService.getAll()
  })


  .get('/:id', ({ params }) => {
    return usersService.getById(Number(params.id))
  }, {
    params: t.Object({ id: t.Numeric() }),
  })

  .delete('/:id', ({ params }) => {
    return usersService.delete(Number(params.id))
  }, {
    params: t.Object({ id: t.Numeric() }),
  })

  .patch('/me', async ({ body, cookie, set }) => {
    const accessToken = cookie.sessionAccessToken.value
    if (!accessToken) { set.status = 401; return { error: 'Non autenticato' } }

    const session = await sessionsService.findByAccessToken(accessToken)
    if (!session) { set.status = 401; return { error: 'Sessione non valida' } }

    const updated = await usersService.updateUserData(session.userId, body)
    return updated
  }, {
    cookie: t.Cookie({ sessionAccessToken: t.String() }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      givenName: t.Optional(t.String({ minLength: 1 })),
      bio: t.Optional(t.String({ maxLength: 300 })),
      isAnonymous: t.Optional(t.Boolean()), // ← nuovo
    })
  })

