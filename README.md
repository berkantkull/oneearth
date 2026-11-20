# ONE EARTH

> One planet. Millions of voices.

ONE EARTH is a cinematic, interactive digital artwork where each visitor can leave one public word at an approximate point on a 3D planet. Every word becomes a light that can be revisited and shared.

## What is included

- Procedurally drawn 3D Earth with atmospheric layers, stars, touch/pointer orbit controls, idle rotation, limited zoom, and reduced-motion support
- Efficient instanced light markers with pulsing animation and selected-light camera focus
- Manual, approximate globe location selection — the app never requests GPS permission
- One-word Unicode validation, basic configurable moderation, payload limits, and plain-text rendering
- Cursor-limited public API routes: `GET/POST /api/lights`, `GET /api/lights/[id]`, and `GET /api/stats`
- Supabase migration with constraints, partial index, RLS, and no anonymous direct table access
- Shared Upstash Redis rate limiting for production; the client IP is hashed before it is used as a temporary limit key
- Deep links and per-light Open Graph metadata at `/light/[id]`
- Responsive desktop/mobile layouts, accessible dialogs and controls, WebGL fallback, and demo mode
- Vitest coverage for coordinates, input validation, and API boundary behavior

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

When Supabase credentials are missing, the app clearly shows **Demo** and uses the local sample lights in `src/data/demo-lights.ts`. A submitted demo light appears in the current browser view but is not persisted.

## Production configuration

Copy `.env.example` and provide:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for shared metadata |
| `SUPABASE_URL` | Production data | Supabase project URL, server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Production data | Server-only writes/reads; never expose to the browser |
| `UPSTASH_REDIS_REST_URL` | Production writes | Shared rate-limit store |
| `UPSTASH_REDIS_REST_TOKEN` | Production writes | Upstash REST credential |
| `RATE_LIMIT_SALT` | Production writes | Long random value used before hashing identifiers |
| `MODERATION_BLOCKLIST` | Optional | Comma-separated basic word blocklist |

Production submissions fail closed if Upstash is not configured. Local development uses an explicitly labeled process-local limiter. Rate-limit identifiers are SHA-256 hashes, not raw IP values. Retention is controlled by the configured Redis provider; use a short TTL policy appropriate to the project. This basic system does not promise complete abuse prevention.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261120000000_create_lights.sql` in the SQL editor or with the Supabase CLI.
3. Add the project URL and **service role** key to the deployment environment only.
4. Do not add a public write policy. Browser clients do not talk to the table directly.

To insert the clearly identified development sample rows after configuring the environment:

```bash
npm run seed
```

To hide a light safely, update `status` to `hidden` in the Supabase dashboard. Public API queries always filter to `visible`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy to Vercel

Import the GitHub repository into Vercel, add the environment variables above, and deploy with the default Next.js settings. The service role key and Upstash token must remain server-only.

## Notes and limitations

- The included land texture is generated in the browser from simplified original polygon shapes, so there are no third-party texture credits or runtime image requests.
- Public reads are bounded to 200 lights per page. The current globe loads only the newest page; large-scale aggregation/clustering is a future step.
- The MVP has a configurable blocklist and hide workflow, not automated moderation or perfect abuse prevention.
- Demo mode contains illustrative data and never presents it as real production activity.
