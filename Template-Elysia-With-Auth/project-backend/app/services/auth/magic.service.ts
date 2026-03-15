import crypto from 'crypto'
import { emailService } from './magic.email.service'
import { magicLinksRepository } from '../../repositories/auth/magic.link.repository'

export const magicLinksService = {
  send: async (email: string, type: 'login' | 'verify-email' = 'login') => {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString() // 15min

    await magicLinksRepository.insert({
      id: crypto.randomUUID(),
      email,
      token,
      expiresAt,
      used: false,
    })

    await emailService.sendMagicLink(email, token, type)
  },

  verify: async (token: string) => {
    const link = await magicLinksRepository.getByToken(token)
    if (!link) throw new Error('Token non valido')
    if (link.used) throw new Error('Token già usato')
    if (new Date(link.expiresAt) < new Date()) throw new Error('Token scaduto')

    await magicLinksRepository.markAsUsed(link.id)
    return link.email
  }
}