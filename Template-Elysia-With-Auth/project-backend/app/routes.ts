// src/routes.ts
// ✅ Questo è l'unico file da modificare per gestire le route
import type { RouteConfig } from '../src/core/loader'

import { googleAuthController } from './controllers/auth/google.auth.controller'

import { usersController } from './controllers/auth/users.controller'

import { sessionsController } from './controllers/auth/sessions.controller'
import { VerifyEmailController } from './controllers/auth/verify.email.controller'
import { MagicAuthController } from './controllers/auth/magic.auth.controller'
import { authMiddleware } from './middleware/auth.middleware'
import { adminController } from './controllers/auth/admin.controller'

export const routes: RouteConfig[] = [
  {
    controller: VerifyEmailController,
    enabled: true,
    middleware: [],
  },
  {
    controller: MagicAuthController,
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
    controller: adminController,
    enabled: true,
    middleware: [authMiddleware],
  },
  {
    controller: usersController,
    enabled: true,
    middleware: [],
  },
]