import { Elysia } from 'elysia'
import { oauth2 } from 'elysia-oauth2'
import { sessionsService } from '../../services/auth/sessions.service'
import { CONFIG } from '../../config/env';

const keys = require('../../config/keys/google.json');

export const googleAuthController = new Elysia({ prefix: '/auth/google' })

  .use(oauth2({
    Google: [keys.web.client_id, keys.web.client_secret, `${CONFIG.host_url}/auth/google/callback`],
  }))

  .get('/', async ({ oauth2, redirect }) => {
    const url = oauth2.createURL('Google', ['email', 'profile'])
    url.searchParams.set('access_type', 'offline')
    return redirect(url.href)
  })

  .get('/callback', async ({ oauth2 }) => {
    const tokens = await oauth2.authorize('Google')
    const session = await sessionsService.handleGoogleCallback(tokens)

    return new Response(null, {
      status: 302,
      headers: {
        "Location": `${CONFIG.app_url}/auth/callback`,
        "Set-Cookie": `sessionAccessToken=${session.accessToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
      }
    })
  })