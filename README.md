# Exportable — Indian Exportable Products Researcher & Recommendation Engine

A modular web platform that helps aspiring and existing Indian exporters research products, evaluate export opportunities, find Indian manufacturers/suppliers, and discover overseas buyers — grounded in cited sources and augmented by AI-driven recommendations.

> **Status:** Phase 1 (MVP). Catalog + product research pages + sources/citations are live. Supplier/buyer discovery, natural-language Q&A, and the recommendation engine are scoped for later phases.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma 5** + **SQLite** (file-based, zero-setup local dev)
- Modular structure: `src/app` (UI routes), `src/components` (reusable UI), `src/lib` (data + utilities), `prisma/` (schema + seed)

The architecture is deliberately portable — to move to Postgres later, change the `datasource db` provider in `prisma/schema.prisma`, set `DATABASE_URL`, and re-run `prisma db push`.

---

## Quick start

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Then open <http://localhost:3000>.

Other useful scripts:

```bash
npm run build        # production build
npm run db:reset     # wipe DB and re-seed
npm run db:seed      # re-run seed only
```

---

## Project structure

```
.
├── docs/
│   └── execution-plan.md        # 4-phase plan
├── prisma/
│   ├── schema.prisma            # data model
│   └── seed.ts                  # Phase 1 seed
├── scripts/
│   └── smoke.ts                 # DB sanity check
├── src/
│   ├── app/                     # App Router routes
│   │   ├── about/
│   │   ├── products/
│   │   │   ├── page.tsx         # all products
│   │   │   └── [slug]/page.tsx  # product profile
│   │   ├── sectors/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx             # home
│   │   └── globals.css
│   ├── components/
│   │   ├── ProductBlocks.tsx    # summary pills, list blocks, sections
│   │   └── SourceList.tsx       # ranked, typed source citations
│   └── lib/
│       ├── prisma.ts            # singleton Prisma client
│       └── sources.ts           # type/authority constants + labels
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data model (Phase 1)

| Model                     | Purpose                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `Sector`                  | Top-level category (e.g. *Agriculture & Food Products*).                                                  |
| `Category`                | Grouping inside a sector (e.g. *Spices*). Unique per sector.                                              |
| `Subcategory`             | Optional sub-grouping (e.g. *Whole Spices*).                                                              |
| `Product`                 | The exportable product profile (HS code, indicative price, demand, capital level, applications, etc.).    |
| `Source`                  | A referenceable source (name, URL, type, authority level, retrieval date, notes).                         |
| `ProductSource`           | Join model: which facts of a product come from which source (`SOURCED` vs `AI_DERIVED`).                  |
| `SpecializedAttribute`    | A configurable attribute type (e.g. *GI tag*, *REACH compliance*, *Halal certification*).                  |
| `SpecializedAttributeValue` | The value of an attribute, attached to a product, a category, or a region/country code.                 |

**Why a flexible specialized-attribute model?** Different products and destinations have different compliance, certification, trademark, and GI requirements. Hard-coding these as fields would be brittle. Instead, attributes are stored as data: new attribute types can be added by inserting a row, with no schema change.

### Authority levels

Sources are ranked by an `authority` string (low → high):

| Code           | Meaning        |
| -------------- | -------------- |
| `L6_AI_DERIVED` | AI-derived (inference) |
| `L5_THIRD_PARTY` | Third-party data |
| `L4_MARKETPLACE` | B2B marketplace |
| `L3_DIRECTORY` | Business directory |
| `L2_INDUSTRY` | Industry/trade body |
| `L1_OFFICIAL` | Government / official trade data |

`SourceList` ranks cited sources by authority, and every fact is labeled `Sourced` or `AI-derived` so the user can always tell which is which.

### Source types

`type ∈ {GOVERNMENT, INDUSTRY_BODY, DIRECTORY, MARKETPLACE, THIRD_PARTY, AI_DERIVED}`.

---

## How to extend

### Add a new sector

1. Add an entry to `SECTORS` in `prisma/seed.ts` (or insert via the API / DB directly).
2. `npm run db:seed` (idempotent — uses `upsert`).

### Add a new product to an existing sector

1. Add an entry to `PRODUCTS` in `prisma/seed.ts`.
2. Re-run `npm run db:seed`.

### Add a new specialized attribute

1. Add an entry to `SPECIALIZED_ATTRIBUTES` in `prisma/seed.ts` (or insert directly).
2. Optionally add `SpecializedAttributeValue` rows attached to a product, category, or `regionCode`.

### Add a new data source

1. Add an entry to `SOURCES` in `prisma/seed.ts`.
2. Attach via `ProductSource` rows when integrating live data.

### Move to Postgres

1. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` in `.env`.
3. `npx prisma db push` (or set up migrations).

---

## Phase 1 scope

- ✅ Modular project structure with clean frontend / backend / data / AI / citation layers.
- ✅ Flexible data model: sectors, categories, subcategories, products, sources, and **configurable** specialized attributes attachable to products, categories, or regions.
- ✅ All 16 sectors from the spec, with products seeded for those that have a known Indian-export HS code.
- ✅ Product profile page with: overview, export opportunity, target markets, capital considerations, compliance/specialized attributes, recommendations preview, sources/citations.
- ✅ Source/citation model with authority ranking and `Sourced` vs `AI-derived` labels.
- ✅ All sample data clearly labeled (`isSample = true`; sample-data banner on profiles).
- ❌ Out of Phase 1: natural-language Q&A, supplier discovery, buyer discovery, recommendation engine (Phase 2/3).

See `docs/execution-plan.md` for the full plan across Phases 1–4.

---

## Data integrity & trust

- **No live trade, supplier, or buyer data is fabricated.** Every quantitative field on a product profile is currently a reasonable reference value, clearly marked `Sample data` in the UI.
- **Sources cited on each product** are real reference points; live retrieval is planned for a later phase and will populate `Source.retrievalDate`.
- **Authority ranking** of citations is rendered visually so a user can judge trust at a glance.

---

## License

Private — internal project.
