# uzlogisticsnet

O'zbekiston logistika tizimlarini raqamli transformatsiyalash va real vaqt monitoring
platformasi — ilmiy-amaliy tadqiqot natijalarini namoyish etuvchi vitrina + logistika
kompaniyalari katalogi va simulyatsiya qilingan real vaqt monitoring dashboardi.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS 4)
- Prisma 7 + SQLite (via `@prisma/adapter-libsql`, so it needs no native compiler toolchain)
- Recharts (KPI/forecast charts), React-Leaflet + OpenStreetMap (maps)
- Server-Sent Events for the simulated "live" shipment feed
- Custom cookie-session admin auth (bcrypt + HMAC-signed cookie, no external auth service)
- Custom lightweight i18n (uz/ru/en) — dictionaries in `lib/i18n/*.json`
- Playwright for end-to-end tests

## Getting started

```bash
npm install
npm run db:migrate   # creates prisma/dev.db and applies the schema
npm run seed          # loads 120 companies + demo shipments/metrics/forecast
npm run dev
```

Open http://localhost:3000.

### Environment variables (`.env`)

```
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
SESSION_SECRET="change-me-in-production"
```

`ADMIN_USERNAME`/`ADMIN_PASSWORD` are only read by `npm run seed` (to create/update the
`AdminUser` row). Change `SESSION_SECRET` to a long random value before deploying.

### Admin panel

Visit `/admin/login` with the seeded credentials (`admin` / `admin123` by default) to
reach `/admin/companies`, a simple CRUD screen for the company catalog.

## Project structure

```
app/                      Next.js App Router routes
  research/               4 ta ilmiy yangilik (scientific showcase pages)
  companies/              Catalog + company profile pages
  dashboard/               Real-time monitoring dashboard
  map/                     Full country map
  analytics/               KPI analytics + /analytics/forecast (2020-2030 chart)
  admin/                   Login + protected companies CRUD
  api/                     Route handlers (companies, shipments, shipments/stream (SSE),
                           metrics/summary, forecast, admin/login, admin/logout)
components/               UI components, grouped by feature
lib/                      prisma client, i18n, auth, simulation engine, regions, kpi config
prisma/                   schema.prisma, migrations, seed.ts
data/                     companies_seed.json (120 company profiles)
scripts/                  build-seed-data.mjs, scrape-goldenpages.ts
tests/                    Playwright E2E tests
```

## Data source & the scraper

The company catalog seed (`data/companies_seed.json`) has 120 profiles: 40 companies
hand-collected from goldenpages.uz's "Логистические компании Узбекистана" rubric
(https://www.goldenpages.uz/rubrics/?Id=4676), pages 1-2 of 13 (242 companies total),
plus 80 deterministic demo profiles with no external source attribution.

`scripts/scrape-goldenpages.ts` is a ready-to-run next stage that would crawl all 13
pages and upsert the full list into the database (`npm run scrape`). It is **not**
run automatically — before using it:

1. Re-check `https://www.goldenpages.uz/robots.txt` still allows crawling `/rubrics/`
   and `/company/`.
2. The CSS selectors in `parseCompanies()` are best-effort guesses at the site's
   current markup — inspect the live page and adjust them first.
3. If the site disallows crawling, use its own "Скачать список" export feature and
   adapt the parsing step instead.

All contact info in the catalog (phone numbers, etc.) is public directory data; phone
numbers are partially masked and only revealed after a user clicks "Telefonni
ko'rsatish" on a company's profile, mirroring the source site's own UX pattern.

## Real-time monitoring — how the simulation works

Every API route in `app/api/shipments/*` and the dashboard is explicitly marked as
**simulated** in the UI (see the disclaimer banner on `/dashboard`). `lib/simulation.ts`
runs a single in-process ticker (every 3s) that mutates `Shipment` rows in the database:
advancing progress along the origin→destination line, flipping status between
`in_transit` / `customs` / `delayed` / `delivered`, and recycling delivered shipments
back into new ones. `/api/shipments/stream` is a Server-Sent Events endpoint that
polls the current state on the same interval and pushes it to connected clients.

This is intentionally a single-process, in-memory-timer simulation — good enough for
a research demo, but a production deployment would replace `lib/simulation.ts` with
real GPS/IoT ingestion (and probably a message queue instead of direct DB polling).

## Testing

```bash
npm run test:e2e
```

Runs Playwright against a freshly started dev server (`playwright.config.ts` boots
`next dev` on port 3100 to avoid colliding with anything already running on 3000).
Covers: home page hero/CTAs, catalog region filtering, and the dashboard's live
connection indicator.

## Deployment

- **App**: Vercel (or any Node host). Set the environment variables above.
- **Database**: for production, either keep SQLite on a persistent volume/Turso, or
  switch `datasource db { provider = "sqlite" }` in `prisma/schema.prisma` to
  `"postgresql"` and swap `lib/prisma.ts` / `prisma/seed.ts` to `@prisma/adapter-pg`
  (or use a hosted Postgres, e.g. Neon/Supabase, and drop the driver-adapter layer
  entirely — Prisma 7 only requires an adapter for SQLite/D1/libSQL setups like this
  one, not for first-class connection-string providers).
- Run `npm run db:migrate` and `npm run seed` once against the production database
  before first deploy.

## Known limitations / next steps

- Only 40 of the 242 companies on the source site are seeded; run the scraper (with
  the caveats above) to fill in the rest.
- i18n covers the entire nav/footer/home/dashboard/analytics/admin chrome in
  uz/ru/en; the four research article bodies are written in Uzbek only (matching the
  source dissertation's primary language).
- The admin panel is intentionally minimal (single hardcoded-at-seed-time user, no
  password reset flow) — sufficient for a single-operator demo, not multi-tenant.
