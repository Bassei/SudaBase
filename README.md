# SudaBase

A production-ready MVP scaffold for a national Sudanese data platform with two pillars:

1. Education data: universities, programs/faculties, rankings, reviews, comparison.
2. Economic / market intelligence: sectors, businesses, competition, indicators.

Built with Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth/RLS, Recharts, and Leaflet-ready dependencies.

## What is included

- Public homepage with platform cards, stats, and market ticker
- `/education`, `/universities`, `/university/[id]`, `/compare-universities`, `/reviews`
- `/economy`, `/sectors`, `/sectors/[id]`, `/businesses`, `/businesses/[id]`, `/market-indicators`
- Protected `/admin` dashboard skeleton using Supabase Auth + allowlisted admin emails
- Student review submission with moderation-ready schema
- Market API routes for USD/SDG and gold with Supabase caching
- Supabase schema, indexes, views, RLS policies, and seed sectors
- Modular components and TypeScript data types

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://njzsvsijxzwnqtxkpgkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
CURRENCY_API_KEY=your-server-side-key
GOLD_API_KEY=your-server-side-key
ADMIN_EMAILS=you@example.com,other-admin@example.com
```

Never place a Supabase service-role key in frontend code.

## Database setup

1. Open Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. Run `supabase/seed.sql` if you want starter sectors.
4. Insert your admin user after the admin logs in once:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'you@example.com'
on conflict do nothing;
```

Your existing `universities` and `programs` tables are reused as-is.

## Market indicators

Routes:

- `GET /api/market/usd-sdg`
- `GET /api/market/gold`
- `POST /api/market/refresh`

The implementation uses `currencyapi.com` and `GoldAPI.io` examples. You can swap providers inside `lib/market.ts`.

Market values are cached in `market_indicators`. The UI clearly states that exchange and gold prices are indicative and may differ from local Sudanese market prices.

## RLS model

- Public can read universities, programs, sectors, businesses, approved reviews, and market indicators.
- Anyone can insert a pending, unverified review.
- Only users listed in `admin_users` can write/edit/approve data.
- Authenticated users can be constrained to one review per university through a partial unique index.

## Data quality

Schema creates these views:

- `v_duplicate_universities`
- `v_missing_university_websites`
- `v_suspicious_programs`

`lib/data-quality.ts` includes utility functions for future admin warnings.

## Notes for production hardening

- Add a CAPTCHA or Turnstile check to the review form API path before public launch.
- Move review insertion through a server action/API route if you need stricter validation or rate limiting.
- Add richer admin CRUD pages when the core public portal is validated.
- Add i18n routing for Arabic and English.
- Add geocoding fields (`latitude`, `longitude`) before enabling Leaflet maps on businesses.
- Run `npm run typecheck` and `npm run lint` before deployment.
