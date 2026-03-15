# elysia-template

Opinionated Elysia template with a layered architecture (controllers, services, repositories) and Drizzle ORM + SQLite. Designed to be used with elysia-cli.

## Stack

- **[Elysia](https://elysiajs.com/)** — fast Bun-native web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** — TypeScript ORM with Drizzle Studio
- **[Bun](https://bun.sh/)** — runtime, package manager, SQLite driver

## Structure

```
elysia-template/
├── index.ts              # entry point — do not modify
├── drizzle.config.ts     # drizzle-kit config
├── config/
│   ├── db.ts             # database connection
│   ├── schema.ts         # drizzle table definitions
│   └── env.ts            # environment variables
├── core/
│   └── loader.ts         # route loader with middleware support
└── app/
    ├── routes.ts         # register your routes here
    ├── controllers/      # routing layer
    ├── services/         # business logic
    ├── repositories/     # database queries
    ├── middleware/       # shared middleware
    └── types/            # inferred types from schema
```

## Getting started

```bash
bun install
cp .env.example .env
bun run push   # sync schema to db
bun run dev    # start dev server
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start with hot reload |
| `bun run start` | Start production server |
| `bun run build` | Compile to single binary |
| `bun run push` | Sync Drizzle schema to database |
| `bun run studio` | Open Drizzle Studio at https://local.drizzle.studio |

## Architecture

Dependency flow is always top-down — never skip a layer.

```
routes.ts → controller → service → repository → db
```

**Controller** — handles routing and request/response only, no business logic.

**Service** — business logic, can call multiple repositories.

**Repository** — database queries only, returns typed results inferred from the Drizzle schema.

## Adding a module

Create the files manually following the naming convention:

```
app/controllers/messages.controller.ts
app/services/messages.service.ts
app/repositories/messages.repository.ts
app/types/messages.types.ts
```

Then register the controller in `app/routes.ts`:

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

Or use **elysia-cli** to generate everything automatically:

```bash
elysia-cli generate messages
```

## Routes config

Each route in `app/routes.ts` accepts the following options:

```typescript
{
  controller: messagesController,  // Elysia instance with prefix
  enabled: true,                   // set false to disable without deleting
  middleware: [loggerMiddleware],   // applied in order before the controller
}
```

## Types

Types are inferred directly from the Drizzle schema — no duplication.

```typescript
// app/types/messages.types.ts
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { messages } from '../../config/schema'

export type Message    = InferSelectModel<typeof messages>
export type NewMessage = InferInsertModel<typeof messages>
```

## Environment

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` or `production` |
| `PORT` | `3000` | server port |
| `DB_PATH` | `app.db` | SQLite file path |

In production the server binds to `0.0.0.0`. In development it binds to `127.0.0.1`.

## Switching to Postgres

In `config/db.ts`, comment out the SQLite block and uncomment the Postgres one:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
```

Update `drizzle.config.ts` dialect to `postgresql` and add `DATABASE_URL` to `.env`.

## License

MIT