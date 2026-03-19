# auth-elysia-template

Full-stack authentication template built with Elysia (Bun), Next.js, Drizzle ORM, and SQLite. Includes Google OAuth, Magic Link login, email verification, session management, and role-based access control. Comes with a GitHub Actions auto-deploy workflow for VPS deployment.

---

## Stack

### Backend

| Package | Version | Role |
|---|---|---|
| Elysia | latest | Bun-native web framework |
| Bun | runtime | Runtime, package manager, SQLite driver |
| Drizzle ORM | ^0.45.1 | TypeScript ORM with Drizzle Studio |
| SQLite (via better-sqlite3) | ^12.6.2 | Embedded database |
| Arctic | ^3.7.0 | OAuth 2.0 provider toolkit |
| elysia-oauth2 | ^2.1.0 | OAuth2 plugin for Elysia |
| Argon2 | ^0.44.0 | Password hashing |
| Nodemailer | ^8.0.2 | Email delivery (magic links, verification) |
| @elysiajs/cors | ^1.4.1 | CORS middleware |

### Frontend

| Package | Version | Role |
|---|---|---|
| Next.js | 16.1.6 | React framework with App Router |
| React | 19.2.3 | UI library |
| TanStack Query | ^5.90.21 | Server state management |
| Tailwind CSS | ^4 | Utility-first CSS |
| TypeScript | ^5 | Type safety |

---

## Authentication Methods

This template supports three authentication strategies:

**Google OAuth 2.0** — Social login via Google. Uses the `arctic` library to handle the authorization code flow and `elysia-oauth2` as the Elysia plugin.

**Magic Link** — Passwordless login via email. A one-time token is generated, stored in the `magic_links` table, sent to the user by email, and consumed on click.

**Email + Password** — Classic credential-based login with password hashing via Argon2 and email verification flow.

---

## Architecture

The backend follows a strict layered architecture. Dependency flow is always top-down — never skip a layer.

```
routes.ts -> controller -> service -> repository -> db
```

**Controller** — handles routing and request/response only. No business logic.

**Service** — business logic. Can call multiple repositories.

**Repository** — database queries only. Returns typed results inferred from the Drizzle schema.

Types are inferred directly from the schema — no duplication.

---

## Project Structure

```
Template-Elysia-With-Auth/
├── project-backend/
│   ├── index.ts                        # entry point — do not modify
│   ├── drizzle.config.ts               # Drizzle kit config
│   ├── config/
│   │   ├── database.ts                 # database connection
│   │   └── schema.ts                   # Drizzle table definitions
│   ├── src/core/
│   │   └── loader.ts                   # route loader with middleware support
│   └── app/
│       ├── routes.ts                   # register routes here
│       ├── environment.ts              # env variable management
│       ├── controllers/auth/
│       │   ├── google.auth.controller.ts
│       │   ├── magic.auth.controller.ts
│       │   ├── verify.email.controller.ts
│       │   ├── sessions.controller.ts
│       │   ├── users.controller.ts
│       │   ├── admin.controller.ts
│       │   ├── profile.controller.ts
│       │   └── lang.controller.ts
│       ├── services/auth/
│       │   ├── magic.service.ts
│       │   ├── magic.email.service.ts
│       │   ├── sessions.service.ts
│       │   └── users.service.ts
│       ├── repositories/auth/
│       │   ├── users.repository.ts
│       │   ├── sessions.repository.ts
│       │   ├── magic.link.repository.ts
│       │   └── admin.repository.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── logger.tsx
│       └── types/auth/
│           ├── users.types.ts
│           ├── sessions.types.ts
│           ├── magic.type.ts
│           └── google.user.types.ts
│
├── project-frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── provider.tsx                # TanStack Query provider
│   │   ├── middleware.ts               # Next.js middleware (auth guard)
│   │   └── [lang]/                     # i18n routing
│   │       ├── layout.tsx
│   │       ├── page.tsx                # home
│   │       ├── auth/
│   │       │   ├── page.tsx            # login page
│   │       │   └── callback/page.tsx   # OAuth callback handler
│   │       ├── me/page.tsx             # user profile
│   │       ├── settings/page.tsx       # user settings
│   │       ├── context/
│   │       │   ├── AuthContext.tsx
│   │       │   └── LangContext.tsx
│   │       ├── hook/
│   │       │   ├── useAdmin.ts
│   │       │   └── useLang.ts
│   │       ├── services/
│   │       │   ├── GoogleAuthServices.tsx
│   │       │   ├── LangService.ts
│   │       │   └── api/fetch.ts
│   │       ├── i18n/
│   │       │   └── translations.ts
│   │       └── types/
│   │           └── auth.ts
│
└── github-auto-deploy-template/
    └── workflows/
        └── deploy.yml                  # GitHub Actions VPS deploy
```

---

## Database Schema

The database uses SQLite (swappable to PostgreSQL). Three core tables:

**users** — stores all user profiles regardless of auth method. Has a `role` enum (`user`, `staff`, `admin`) for role-based access control.

**sessions** — access tokens with expiry and validity flag. Cascade deletes on user removal.

**magic_links** — one-time tokens for passwordless login. Marked as `used` after consumption.

---

## Prerequisites

- Bun >= 1.x
- Node.js >= 18.x (for Next.js)
- A Google Cloud project with OAuth 2.0 credentials
- An SMTP service for email delivery (magic links + email verification)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kliti72/auth-elysia-template.git
cd auth-elysia-template/Template-Elysia-With-Auth
```

### 2. Backend setup

```bash
cd project-backend
bun install
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=3000
DB_PATH=./config/database/app.db

// or add keys on /config/keys/google_key.json (change this)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
```

Sync the database schema and start the dev server:

```bash
bun run push    # sync Drizzle schema to SQLite
bun run dev     # start with hot reload
```

Backend runs at: `http://localhost:3000`

### 3. Frontend setup

```bash
cd ../project-frontend
bun install
bun run dev     # starts on port 3001
```

Frontend runs at: `http://localhost:3001`

---

## Backend Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start with hot reload |
| `bun run push` | Sync Drizzle schema to database |
| `bun run studio` | Open Drizzle Studio at https://local.drizzle.studio |

## Frontend Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server on port 3001 |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |

---

## Routes

### Authentication

| Method | Path | Description | Auth Required |
|---|---|---|---|
| GET | `/auth/google` | Initiate Google OAuth flow | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| POST | `/auth/magic` | Request magic link | No |
| GET | `/auth/magic/verify` | Verify magic link token | No |
| GET | `/auth/verify-email` | Verify email address | No |
| POST | `/auth/login` | Email/password login | No |
| POST | `/auth/logout` | Invalidate session | Yes |

### Users & Sessions

| Method | Path | Description | Auth Required |
|---|---|---|---|
| GET | `/users/me` | Get current user | Yes |
| PATCH | `/users/profile` | Update profile | Yes |
| GET | `/sessions` | List active sessions | Yes |
| DELETE | `/sessions/:id` | Revoke a session | Yes |

### Admin

| Method | Path | Description | Auth Required |
|---|---|---|---|
| GET | `/admin/users` | List all users | Yes (admin role) |

---

## Role-Based Access Control

Users have one of three roles: `user`, `staff`, or `admin`.

The `authMiddleware` protects routes that require authentication. Admin routes additionally check that the session user has the `admin` role.

```typescript
// app/routes.ts
{
  controller: adminController,
  enabled: true,
  middleware: [authMiddleware],  // protected
}
```

---

## Adding a New Module

Create the files following the naming convention:

```
app/controllers/messages.controller.ts
app/services/messages.service.ts
app/repositories/messages.repository.ts
app/types/messages.types.ts
```

Register the controller in `app/routes.ts`:

```typescript
import { messagesController } from './controllers/messages.controller'

export const routes: RouteConfig[] = [
  {
    controller: messagesController,
    enabled: true,
    middleware: [],
  },
]
```

Or use elysia-cli to generate everything automatically:

```bash
elysia-cli generate messages
```

---

## Switching to PostgreSQL

In `config/database.ts`, replace the SQLite driver with the Postgres one:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
```

Update `drizzle.config.ts` dialect to `postgresql` and add `DATABASE_URL` to your `.env`.

---

## CI/CD — Auto Deploy to VPS

A GitHub Actions workflow is included in `github-auto-deploy-template/workflows/deploy.yml`. On every push to `main` it SSHes into the VPS, pulls the latest code, rebuilds frontend and backend, and restarts the systemd services via Nginx.

Required GitHub Secrets:

| Secret | Description |
|---|---|
| `SSH_HOST` | VPS IP or hostname |
| `SSH_PRIVATE_KEY` | Private SSH key for the deploy user |

---

## i18n

The frontend uses Next.js dynamic `[lang]` routing for internationalization. Translations live in `app/[lang]/i18n/translations.ts`. The `LangContext` and `useLang` hook handle language switching at runtime.

---

## Environment Variables Reference

### Backend

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` or `production` |
| `PORT` | `3000` (dev) / `5000` (prod) | Server port |
| `DB_PATH` | `./config/database/app.db` | SQLite file path |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | — | OAuth callback URL |
| `SMTP_*` | — | SMTP credentials for email |

In production the server binds to `0.0.0.0`. In development it binds to `localhost`.

---

## License

MIT
