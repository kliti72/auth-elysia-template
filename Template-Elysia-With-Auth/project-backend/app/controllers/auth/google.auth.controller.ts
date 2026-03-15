// src/modules/health/health.controller.ts
import { Elysia } from 'elysia'
import { oauth2 } from 'elysia-oauth2'
import { fromGoogleResponse, type GoogleUserRaw, type Users } from '../../types/auth/google.user.types';
import { sessionsService } from '../../services/auth/sessions.service';
import { usersService } from '../../services/auth/users.service';

const keys = require('../../../config/keys/google.oauth2.keys.json');

export const googleAuthController = new Elysia({ prefix: '/auth/google' })

  .use(oauth2({
    Google: [keys.web.client_id, keys.web.client_secret, `${Bun.env.HOST_URL}/auth/google/callback`],
  }))

  .get('/', async ({ oauth2, redirect }) => {
    const url = oauth2.createURL('Google', ['email', 'profile'])
    url.searchParams.set('access_type', 'offline')
    return redirect(url.href)
  })

  .get('/callback', async ({ oauth2 }) => {
    const tokens = await oauth2.authorize('Google')
    const accessToken = tokens.accessToken()

    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!res.ok) return new Error("User not found");

    const googleUserResponse = await res.json() as GoogleUserRaw
    let user = await usersService.getByEmail(googleUserResponse.email)
    let session;

    if (!user) {
      user = await usersService.create(fromGoogleResponse(googleUserResponse))
      session = await sessionsService.createGoogleToken(tokens, user);
    } else {
      const existingSession = await sessionsService.getActiveByUserId(user.id)
      if (existingSession) {
        // ← aggiorna con il nuovo token
        session = await sessionsService.updateGoogleToken(existingSession.id, tokens)
      } else {
        session = await sessionsService.createGoogleToken(tokens, user)
      }
    }

    // ← cookie sempre aggiornato con il token corrente
    return new Response(null, {
      status: 302,
      headers: {
        "Location": `${Bun.env.APP_URL}/auth/callback`,
        "Set-Cookie": `sessionAccessToken=${session.accessToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
      }
    })
  })