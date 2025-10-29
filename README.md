# Mangasss

Minimal web reader for manga that aggregates content from multiple providers, keeps track of your reading progress. Built with SvelteKit 2 and the Svelte 5 runes API, backed by Turso/LibSQL via Drizzle ORM, and bundled to run on Bun in production.

## Features
- Type-to-search across supported manga providers with responsive UI components
- Per-provider reading pages with progress tracking stored in the Library view
- Lucia-powered authentication flow with session-aware routing
- Server-side API helpers and sync endpoint for persisting reading history
- Built-in Prometheus-compatible metrics (`/metrics`) for request timing and process stats

## Tech Stack
- **Runtime / Framework**: SvelteKit 2, Svelte 5 runes, Vite, Bun 1.x
- **UI**: Tailwind variants, Bits UI primitives, Lucide icon set
- **Auth & Data**: Lucia Auth, Drizzle ORM, LibSQL/Turso
- **Monitoring**: prom-client for metrics instrumentation, optional Prometheus / Grafana stack
- **Tooling**: TypeScript, Biome, Drizzle Kit, Bun as package manager and runtime

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) 1.0 or newer (preferred) *or* Node.js 20+ with npm/PNPM
- A Turso (LibSQL) database URL and auth token if you plan to sync reading data
- Docker (optional) if you want to run the monitoring stack locally

### Installation
```bash
git clone https://github.com/yagnikpt/mangasss.git
cd mangasss

# install dependencies
bun install
# or: npm install
```

Copy `.env.example` to `.env` (create the file if it does not exist yet) and populate it:

```env
PROD_DATABASE_URL="libsql://<database-url>"
TURSO_TOKEN="<turso-auth-token>"
```

### Database migration
Run Drizzle migrations against your Turso instance:

```bash
# pushes the schema defined in drizzle.config.ts
bun run db:push
```

## Development

Start the SvelteKit dev server (hot-module reloading, Vite tooling):

```bash
# open dev server on http://localhost:5173 by default
bun run dev

# open browser automatically
bun run dev -- --open
```

The app uses Lucia sessions; once logged in you can access the `/library` route to manage saved reads. The `/api/sync` endpoint synchronises reading progress between client and server.

## Production Build & Runtime
Switch adapter from `@sveltejs/adapter-vercel` to `@sveltejs/adapter-node` in `svelte.config.js`

```bash
# generate production assets in build/
bun run build

# serve using the svelte server
bun run index.js
```

The custom server listens on `PORT` (defaults to `3000`).

### Docker (optional)

```bash
# build container
docker build -t mangasss .

# run container with env vars and port mapping
docker run --env-file .env -e -p 3000:3000 mangasss
```

## Contributing

Issues and pull requests are welcome. Please run `bun run check` before submitting changes and ensure any new database schema updates are reflected through Drizzle migrations.