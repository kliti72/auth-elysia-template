import type { RouteConfig } from '../app/config/loader'

import { googleAuthController } from './controllers/auth/google.auth.controller'
import { usersController } from './controllers/auth/users.controller'
import { sessionsController } from './controllers/auth/sessions.controller'
import { verifyEmailController } from './controllers/auth/verify.email.controller'
import { magicAuthController } from './controllers/auth/magic.auth.controller'
import { adminController } from './controllers/auth/_admin.controller'

export const routes: RouteConfig[] = [
  {
    controller: verifyEmailController,
    enabled: true,
    middleware: [],
  },
  {
    controller: magicAuthController,
    enabled: true,
    middleware: [],
  },
  {
    controller: googleAuthController,
    enabled: true,
    middleware: [],
  },
  {
    controller: sessionsController,
    enabled: true,
    middleware: [],
  },
  {
    controller: usersController,
    enabled: true,
    middleware: [],
  },
  {
    controller: adminController,
    enabled: true,
    middleware: [],
  },
]