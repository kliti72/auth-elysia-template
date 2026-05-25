import type { OAuth2Tokens } from 'arctic'
import { sessionsRepository } from '../../repositories/auth/sessions.repository'
import { usersService } from './users.service'
import { fromGoogleResponse, type GoogleUserRaw } from '../../types/auth/google.user.types'
import type { Users } from '../../types/auth/users.types'

export const sessionsService = {

  getAll() {
    return sessionsRepository.findAll()
  },

  getActiveByUserId(id: number) {
    const item = sessionsRepository.findByUserId(id)
    if (!item) throw new Error(`Sessions ${id} not found.`)
    return item
  },

  findByAccessToken(accessToken: string) {
    const item = sessionsRepository.findByAccessToken(accessToken)
    if (!item) throw new Error(`Sessions ${accessToken} not found.`)
    return item
  },

  invalidate(sessionId: string) {
    const item = sessionsRepository.findById(sessionId)
    if (!item) throw new Error(`Session ${sessionId} not found.`)
    return sessionsRepository.update(sessionId, { isValid: false })
  },

  createGoogleToken(tokens: OAuth2Tokens, user: Users) {
    const session = {
      id: crypto.randomUUID(),
      userId: user.id,
      accessToken: tokens.accessToken(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      isValid: true,
    }
    return sessionsRepository.insert(session)
  },

  createMagicLinkSession(user: Users) {
    const session = {
      id: crypto.randomUUID(),
      userId: user.id,
      accessToken: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      isValid: true,
    }
    return sessionsRepository.insert(session)
  },

  updateGoogleToken(id: string, tokens: OAuth2Tokens) {
    const updates = {
      accessToken: tokens.accessToken(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      isValid: true,
    }
    const updated = sessionsRepository.update(id, updates)
    if (!updated) throw new Error(`Session ${id} not found.`)
    return updated
  },

  delete(id: string) {
    const deleted = sessionsRepository.remove(id)
    if (!deleted) throw new Error(`Sessions ${id} not found.`)
    return { ok: true }
  },

  // ── LOGICA GOOGLE CALLBACK ──────────────────────────────────────────

  async handleGoogleCallback(tokens: OAuth2Tokens) {
    const accessToken = tokens.accessToken()

    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!res.ok) throw new Error('User not found')

    const googleUserResponse = await res.json() as GoogleUserRaw
    let user = await usersService.getByEmail(googleUserResponse.email)
    let session;

    if (!user) {
      user = await usersService.create(fromGoogleResponse(googleUserResponse))
      session = await sessionsService.createGoogleToken(tokens, user)
    } else {
      const existingSession = await sessionsRepository.findByUserId(user.id)
      if (existingSession) {
        session = await sessionsService.updateGoogleToken(existingSession.id, tokens)
      } else {
        session = await sessionsService.createGoogleToken(tokens, user)
      }
    }

    return session
  }

}