import { Elysia, t } from 'elysia'
import { userRepository } from '../../repositories/auth/users.repository';

// Controller for create first admin
export const adminController = new Elysia({ prefix: '/admin' })

    .get('/bootstrap/:email', async ({ params, set }) => {
        const BOOTSTRAP_EMAIL = 'kliti7085@gmail.com'

        if (params.email !== BOOTSTRAP_EMAIL) {
            set.status = 403
            throw new Error('Non autorizzato')
        }
        return userRepository.updateUserRole(params.email, 'admin')
    })