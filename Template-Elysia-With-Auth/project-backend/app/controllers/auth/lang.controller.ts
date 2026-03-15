import Elysia, { t } from 'elysia'
import { authMiddleware } from '../../middleware/auth.middleware'
import * as profileRepository from '../../repositories/auth/users.repository';

const VALID_LOCALES = ['it', 'en', 'fr', 'es', 'pt', 'de']

export const langController = new Elysia({ prefix: '/lang' })
  .use(authMiddleware)

  // PATCH /lang  { locale: "en" }
  .patch('/', async ({ body, userId, set }) => {
    if (!VALID_LOCALES.includes(body.locale)) {
      set.status = 400
      return { error: 'Locale non valido' }
    }
    const updated = await profileRepository.updateLocale(userId, body.locale)
    return { locale: updated.locale }
  }, {
    body: t.Object({
      locale: t.String(),
    })
  })