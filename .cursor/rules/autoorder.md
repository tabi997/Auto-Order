# AutoOrder – Project Rules (Persistent)

## Context
- Site/aplicație pentru „mașini la comandă” (sourcing din licitații B2B, ex. OPENLANE).
- MVP: captare lead-uri, calculator estimativ transparent, admin minim (requests, sourcing lots), UX curat.
- Fără scraping/republicare de conținut protejat; loturile se introduc manual de utilizator.

## Stack
- Next.js 14 (App Router) + TypeScript
- TailwindCSS + shadcn/ui
- Prisma (SQLite dev, Postgres prod prin ENV)
- next-auth (email magic link)
- Zod + react-hook-form
- API: route handlers `/api/*`
- Vitest (teste calcul estimări)

## Securitate (OWASP ASVS L1)
- Validare server-side (Zod) pentru toate input-urile.
- Protejează `/admin/*` (next-auth middleware).
- Rate-limit pe POST public (`/api/requests`, `/api/estimate/preview`).
- Headere: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimă.
- ENV nu intră în git; în producție setate ca Sensitive.
- Fără fetch extern către pagini protejate prin login; fără scraping OPENLANE.

## Calitate & DX
- ESLint + Prettier, cod tipat, UI accesibil (dark mode, focus states).
- README documentează setup, seed, deploy și orice feature nou.

## Modele (ghid)
- User { id, name, email, role: 'ADMIN'|'STAFF', createdAt }
- CustomerRequest { date client, preferințe, status pipeline }
- SourcingLot { source='openlane', url, meta, status; introdus manual }
- EstimateConfig { commissionFixed, commissionPct, transportJson, taxJson }
- Estimate { breakdown + total }

## Disclaimer public
- Estimările sunt informative; nu reprezintă prețuri OPENLANE și nu sunt oferte ferme.

## TODO viitoare
- Extensie Chrome MV3 „Save to AutoOrder”
- Import CSV, notificări Telegram/email, white-label
