# auth-elysia-template

Full-stack authentication template built with Elysia (Bun), Next.js, Drizzle ORM, and SQLite. Includes Google OAuth, Magic Link login, email verification (to do), session management, and role-based access control. Comes with a GitHub Actions auto-deploy workflow.

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
│   │   ├── provider.tsx                
│   │   ├── middleware.ts               
│   │   └── [lang]/                     
│   │       ├── layout.tsx
│   │       ├── page.tsx                
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

`Add you Google OAuth Keys on: 
/config/keys/google_key.json (change this)`

NODE_ENV='DEV'
SCEHMA_PATH='./database/schema.ts'
PATH_DB='./database/storage/store.db'
HOST='localhost'
PORT='4040'
HOST_URL='http://localhost:4040'
APP_URL='http://localhost:3001'

# Config Email
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=noreply@versify.art
SMTP_PASS=##############
SMTP_FROM=noreply@versify.art

for read this config, use app/config/env.ts
```

Sync the database schema and start the dev server:

```bash
bun run push    # sync Drizzle schema to SQLite
bun run dev     # start with hot reload
```


## Adding a New Module

Create the files following the naming convention:
Create your table in "project-backend/app/database/schema.json"

// Create the MVC

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


Backend runs at: `http://localhost:4040`

### 3. Frontend setup

```bash
cd ../project-frontend
bun install
bun run dev    
```

Edit `.env`:

```env

NODE_ENV='DEV'
HOST_API_URL="http://localhost:4040"

for read this config, use app/config/env.ts
```

Frontend runs at: `http://localhost:3031`
---

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
| GET | `/sessions` | List active sessions | Yes |

### Admin

| Method | Path | Description | Auth Required |
|---|---|---|---|
| GET | `/admin/users` | List all users | Yes (admin role) |

---

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

## i18n

The frontend uses Next.js dynamic `[lang]` routing for internationalization. Translations live in `app/[lang]/i18n/translations.ts`. The `LangContext` and `useLang` hook handle language switching at runtime.

---

## License

MIT
