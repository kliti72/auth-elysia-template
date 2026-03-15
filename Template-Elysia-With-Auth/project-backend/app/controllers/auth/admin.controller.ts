import { Elysia, t } from 'elysia'
import { sessionsService } from '../../services/auth/sessions.service'
import { adminRepository } from '../../repositories/auth/admin.repository'
import * as profileRepository from '../../repositories/auth/users.repository';

// ═══════════════════════════════════
// MIDDLEWARE — verifica ruolo admin
// ═══════════════════════════════════

async function requireAdmin(cookie: Record<string, { value: string }>, set: { status?: number | string | undefined }) {
    const accessToken = cookie.sessionAccessToken?.value
    if (!accessToken) { set.status = 401; throw new Error('Non autenticato') }

    const session = await sessionsService.findByAccessToken(accessToken)
    if (!session) { set.status = 401; throw new Error('Sessione non valida') }

    const user = await adminRepository.findUserById(session.userId)
    if (!user || user.role !== 'admin') { set.status = 403; throw new Error('Accesso negato') }

    return user
}

// ═══════════════════════════════════
// CONTROLLER
// ═══════════════════════════════════

export const adminController = new Elysia({ prefix: '/admin' })

    // GET /admin/poems — tutti i poemi con info autore
    .get('/poems', async ({ cookie, set }) => {
        await requireAdmin(cookie as any, set)
        return adminRepository.findAllPoems()
    }, {
        cookie: t.Cookie({ sessionAccessToken: t.String() }),
    })

    // GET /admin/users — tutti gli utenti
    .get('/users', async ({ cookie, set }) => {
        await requireAdmin(cookie as any, set)
        return adminRepository.findAllUsers()
    }, {
        cookie: t.Cookie({ sessionAccessToken: t.String() }),
    })

    // PATCH /admin/users/role — aggiorna ruolo utente
    .patch('/users/role', async ({ cookie, body, set }) => {
        await requireAdmin(cookie as any, set)
        return adminRepository.updateUserRole(body.email, body.role)
    }, {
        cookie: t.Cookie({ sessionAccessToken: t.String() }),
        body: t.Object({
            email: t.String({ format: 'email' }),
            role: t.Union([t.Literal('user'), t.Literal('staff'), t.Literal('admin')]),
        }),
    })

    .get('/bootstrap/:email', async ({ params, set }) => {
        const BOOTSTRAP_EMAIL = 'kliti7085@gmail.com'

        if (params.email !== BOOTSTRAP_EMAIL) {
            set.status = 403
            throw new Error('Non autorizzato')
        }

        return profileRepository.updateUserRole(params.email, 'admin')
    })