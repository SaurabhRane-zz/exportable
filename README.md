# Exportable — Indian Exportable Products Researcher & Recommendation Engine

A modular web platform that helps aspiring and existing Indian exporters research products, evaluate export opportunities, find Indian manufacturers/suppliers, and discover overseas buyers — grounded in cited sources and augmented by AI-driven recommendations.

> **Status:** Phase 2 — Search, natural-language research, and supplier/buyer discovery are live. The recommendation engine, comparative evaluation, and connection pathways are scoped for later phases.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma 5** + **SQLite** (file-based, zero-setup local dev)
- Modular structure: `src/app` (UI routes + Route Handlers), `src/components` (reusable UI), `src/lib` (data + retrieval + utilities), `prisma/` (schema + seed)

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

## Docker

A multi-stage `Dockerfile` is included so the app can run in a sandboxed container without installing Node or Prisma on the host.

```bash
docker build -t exportable .
docker run --rm -p 3000:3000 exportable
```

Then open <http://localhost:3000>.

The image bakes a seeded SQLite database at `/app/prisma/dev.db`. Restarting the container preserves the data, but `docker run` without a volume does **not** persist data across container removal. To keep the DB between runs, mount a volume on the `prisma/` directory:

```bash
docker run --rm -p 3000:3000 -v exportable-data:/app/prisma exportable
```

After editing `prisma/seed.ts` or `prisma/schema.prisma`, rebuild without the cache so the new DB is baked in:

```bash
docker build --no-cache -t exportable .
```

The Q&A endpoint can be smoke-tested from the host:

```bash
curl -s http://localhost:3000/api/qa \
  -X POST -H 'content-type: application/json' \
  -d '{"question":"handicrafts with low capital"}'
```

---

## Project structure

```
.
├── docs/
│   └── execution-plan.md        # 4-phase plan
├── prisma/
│   ├── schema.prisma            # data model (Phase 1 + Phase 2)
│   └── seed.ts                  # sectors, products, companies, Q&A docs
├── scripts/
│   └── smoke.ts                 # DB sanity check
├── src/
│   ├── app/                     # App Router routes
│   │   ├── about/
│   │   ├── api/qa/route.ts      # JSON Q&A endpoint
│   │   ├── ask/                 # natural-language Q&A
│   │   ├── companies/           # supplier + buyer discovery
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── search/              # structured search & filter
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
│       ├── company.ts           # company kind / provenance / QA-kind labels
│       ├── prisma.ts            # singleton Prisma client
│       ├── qa.ts                # Q&A retrieval + answer composition
│       ├── search.ts            # structured search helpers
│       └── sources.ts           # type/authority constants + labels
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data model (Phase 1 + Phase 2)

| Model                          | Purpose                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `Sector`                       | Top-level category (e.g. *Agriculture & Food Products*).                                                  |
| `Category`                     | Grouping inside a sector (e.g. *Spices*). Unique per sector.                                              |
| `Subcategory`                  | Optional sub-grouping (e.g. *Whole Spices*).                                                              |
| `Product`                      | The exportable product profile (HS code, indicative price, demand, capital level, applications, etc.).    |
| `Source`                       | A referenceable source (name, URL, type, authority level, retrieval date, notes).                         |
| `ProductSource`                | Join model: which facts of a product come from which source (`SOURCED` vs `AI_DERIVED`).                  |
| `SpecializedAttribute`         | A configurable attribute type (e.g. *GI tag*, *REACH compliance*, *Halal certification*).                  |
| `SpecializedAttributeValue`    | The value of an attribute, attached to a product, a category, or a region/country code.                   |
| `Company`                      | **Phase 2.** Unified supplier (Indian) + buyer (overseas) profile with data-provenance label.             |
| `CompanyProduct`               | **Phase 2.** Which products a company supplies / sources.                                                 |
| `CompanySource`                | **Phase 2.** Citations for company-level facts.                                                           |
| `QaDocument`                   | **Phase 2.** Indexed, citation-ready snippets the Q&A pipeline retrieves and quotes verbatim.            |

**Why a flexible specialized-attribute model?** Different products and destinations have different compliance, certification, trademark, and GI requirements. Hard-coding these as fields would be brittle. Instead, attributes are stored as data: new attribute types can be added by inserting a row, with no schema change.

**Why a unified `Company` model?** A single table lets the same profile page serve both an Indian supplier and an overseas buyer, lets the search page filter them by sector/country, and lets the recommendation engine (Phase 3) work with a single representation. `kind` discriminates, and `dataProvenance` is rendered as a visible label so users can judge trust at a glance.

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

### Data provenance (Phase 2)

Companies carry a `dataProvenance` label:

| Code            | Meaning                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `VERIFIED`      | Pulled from a verified primary source (e.g. FIEO member directory).     |
| `PUBLIC_LISTING`| Scraped from a public listing (e.g. IndiaMART, TradeIndia, Alibaba).     |
| `INFERRED`      | AI-inferred from public web pages.                                        |
| `AI_DERIVED`    | Generated text, not tied to a single source.                             |

In the UI these appear as colored chips: green for `VERIFIED`, neutral for `PUBLIC_LISTING`, amber for `INFERRED`/`AI_DERIVED`.

### Source types

`type ∈ {GOVERNMENT, INDUSTRY_BODY, DIRECTORY, MARKETPLACE, THIRD_PARTY, AI_DERIVED}`.

---

## Phase 2 features

- **Structured search** (`/search`): filter products, Indian suppliers, and overseas buyers by sector, country, capital, demand, and free-text keyword. Tabs split the result list into Products and Companies. Server-rendered for fast first paint and clean URLs (no client-side hydration needed).
- **Natural-language Q&A** (`/ask`): a plain-English question is matched against the indexed `QaDocument` snippets in the database. The top-N matches are surfaced and the answer is composed by quoting them verbatim. **No language model is allowed to invent facts.** Every cited source carries its authority level and retrieval date.
- **Q&A API** (`POST /api/qa`): the same retrieval is exposed as a JSON endpoint so it can be wired into the Phase 3 recommendation engine and any external client.
- **Supplier/buyer discovery** (`/companies` and `/companies/[slug]`): a unified Companies view with sample Indian suppliers and overseas buyers, with a data-provenance label and a sources panel on every profile. Sample records are clearly labeled.
- **Product profile updates** (`/products/[slug]`): each product now shows linked sample suppliers and buyers, in addition to compliance and sources.

### Try these questions in `/ask`

- "Which handicrafts have good export potential with low capital?"
- "Find Indian manufacturers for eco-friendly packaging."
- "What certifications are required to export food products to Germany?"
- "Where can I find Japanese buyers for Indian handicrafts?"
- "What is REACH compliance for Indian chemical exporters?"

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
2. Attach via `ProductSource`, `CompanySource`, or as the `sourceId` on a `QaDocument` when integrating live data.

### Add a new sample company

1. Add an entry to `SUPPLIERS` or `BUYERS` in `prisma/seed.ts`.
2. Re-run `npm run db:seed`. The seed attaches sample `CompanySource` rows automatically.

### Add a new Q&A snippet

1. Add an entry to `QA_DOCS` in `prisma/seed.ts` (title, body, kind, tags, sourceId).
2. Re-run `npm run db:seed`. The retriever in `src/lib/qa.ts` will index the new snippet on the next request.

### Move to Postgres

1. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` in `.env`.
3. `npx prisma db push` (or set up migrations).

---

## Phase scope

- ✅ **Phase 1** — modular project structure, flexible data model, all 16 sectors, products with citations, sample data labels.
- ✅ **Phase 2** — structured search, natural-language Q&A, supplier/buyer discovery, unified company profile, RAG-ready retrieval architecture.
- ⏳ **Phase 3** — recommendation engine, comparative evaluation, market intelligence.
- ⏳ **Phase 4** — connection pathways, user accounts, RAG pipeline hardening, extensibility hooks.

See `docs/execution-plan.md` for the full plan.

---

## Data integrity & trust

- **No live trade, supplier, or buyer data is fabricated.** Every quantitative field on a product profile, every company profile, and every Q&A snippet is currently a reasonable reference value, clearly marked `Sample data` in the UI.
- **Sources cited on each entity** are real reference points; live retrieval is planned for a later phase and will populate `Source.retrievalDate` and flip `Company.isSample` to `false`.
- **Authority ranking** of citations is rendered visually so a user can judge trust at a glance.
- **The Q&A pipeline is retrieval-only.** Every sentence in an answer is either a quoted snippet from a retrieved document or a templated summary line that names the documents it draws from.

---

## License

Private — internal project.
