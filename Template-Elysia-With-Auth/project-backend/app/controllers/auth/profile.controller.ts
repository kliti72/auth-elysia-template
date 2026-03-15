import Elysia from "elysia";
import * as profileRepository from '../../repositories/auth/users.repository';

export const ProfileController = new Elysia({ prefix: '/profile' })

  .get('/:handle', async ({ params }) => {
    const profile = await profileRepository.findByHandle(params.handle) 
    if (!profile) throw new Error('Profile not found')
    const userPoems = await profileRepository.findPublishedPoems(profile.id)
    return { ...profile, poems: userPoems }
  })
