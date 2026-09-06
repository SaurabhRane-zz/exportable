# Indian Exportable Products Researcher & Recommendation Engine — Execution Plan

## Overview

This plan delivers a modular web application that helps aspiring and existing Indian exporters research products, evaluate export opportunities, find Indian suppliers/manufacturers, and discover overseas buyers — grounded in cited sources and augmented by AI-driven recommendations.

The work is divided into **four phases**, each producing a usable, demonstrable milestone while leaving room for the next phase to build on a stable foundation.

---

## Phase 1 — Foundation, Data Model & Catalog (Core Platform)

**Objective:** Establish the application shell, the flexible data model, the sector/product catalog, and the product profile experience using curated, clearly-labeled sample data.

### Deliverables

- Project scaffolding with clean separation between frontend, backend/API, data, AI, and citation layers.
- Backend API with modular structure for future data-source integrations.
- Flexible, extensible data model supporting:
  - Sectors → Categories → Subcategories → Products
  - Core product attributes (description, applications, target industries, indicative pricing, demand, etc.)
  - Specialized attributes that can attach to a product, category, vendor, region, or market (e.g., GI tags, certifications, compliance, safety).
- Seeded catalog covering a representative set of sectors (Agriculture & Food, Textiles & Apparel, Handicrafts, Gems & Jewellery, Leather, Engineering & Machinery, Chemicals & Pharma, Home & Kitchen, Beauty & Personal Care, Packaging, etc.).
- Product Profile page with sections: Overview, Export Opportunity, Target Markets, Capital Considerations, Compliance, Competition, Recommendations, Sources.
- Sectors and Products browse pages.
- Source/citation data model with source name, URL, type (government / industry body / marketplace / directory / AI-derived), authority level, retrieval date, and freshness status.
- Clear labeling of all sample/demo data so no fabricated trade, supplier, or buyer information is presented as real.

### Exit Criteria

- A user can browse sectors, drill into a product, and view a full profile with citations.
- A new sector, category, or specialized attribute can be added with **no major code change**.

---

## Phase 2 — Search, Natural-Language Research & Supplier/Buyer Discovery

**Objective:** Enable users to actively research and discover relevant companies, both in India and abroad, using both structured search and natural-language questions.

### Deliverables

- Structured search & filtering:
  - By sector, product, country, supplier, buyer, category, and other key attributes.
- Natural-language research interface that supports questions such as:
  - "Which handicrafts have good export potential with low capital?"
  - "Find Indian manufacturers for eco-friendly packaging."
  - "What certifications are required to export this product to Germany?"
- Retrieval-based question answering using indexed structured data + source documents (RAG-ready architecture), so answers are grounded in evidence rather than fabricated.
- Supplier / Manufacturer Discovery module:
  - Company name, product/category, location, contact info (where publicly available), website, marketplace profile, certifications, source.
  - Clear distinction between verified, publicly listed, inferred, and AI-derived data.
- Overseas Buyer Discovery module:
  - Importers, distributors, wholesalers, retailers, B2B buyers, target countries, source citations.
- A unified Company profile view usable for both Indian suppliers and overseas buyers.
- Source citations rendered alongside every fact, with retrieval date and authority level visible.

### Exit Criteria

- A user can ask a natural-language question and get a cited, evidence-grounded answer.
- A user can discover and review at least sample Indian suppliers and overseas buyers per product, with clear data-source provenance.

---

## Phase 3 — Recommendation Engine, Market Intelligence & Comparative Evaluation

**Objective:** Move from raw discovery to actionable intelligence: ranked recommendations, comparative views, and market-entry guidance.

### Deliverables

- Recommendation engine that synthesizes structured data + sources and produces:
  - Products worth researching further (by export potential, capital fit, demand signals).
  - Suggested target markets/regions per product.
  - Suggested supplier shortlists and buyer shortlists.
  - Relevant marketplaces/directories to publish on.
  - Certifications/compliance checklists per product + destination.
- Each recommendation includes:
  - The "why" (explanation of reasoning).
  - Underlying supporting evidence and source citations.
  - A label distinguishing AI inference from sourced facts.
- Comparative views:
  - Compare products (potential, capital, compliance burden).
  - Compare target countries (demand, regulatory entry difficulty).
  - Compare suppliers and buyers side-by-side.
- Market intelligence views per product: indicative pricing bands, competition level, target buyer segments, and seasonality (where data is available).
- Trust/quality layer: sources ranked by authority (government → industry body → established directory → marketplace → third-party → AI inference); uncertainty surfaced where data is incomplete or conflicting.
- Data freshness indicators on product, supplier, buyer, and market data, with last-updated timestamps.

### Exit Criteria

- A user can answer: *"What should I export, where, and to whom?"* through ranked, cited recommendations.
- Every recommendation is explainable and traceable to its sources.

---

## Phase 4 — User Experience Polish, Connection Pathways & Extensibility Hooks

**Objective:** Polish the end-to-end journey from Discover → Decide, and lay the architectural groundwork for future buyer–supplier matching and marketplace capabilities.

### Deliverables

- Polished, modern, data-oriented UI tailored for non-expert aspiring exporters while retaining depth for trade professionals.
- Guided journey flows:
  - Discover → Research → Evaluate → Find Suppliers → Find Buyers → Connect → Decide.
- "Connect" pathways: practical avenues to reach suppliers and buyers (marketplace listings, trade events, FIEO/ECGC/MPEDA-relevant channels, directory links, sample outreach templates) — clearly labeled as guidance, not automated outreach.
- User accounts / saved research (lightweight auth + saved products, searches, and shortlists).
- RAG pipeline hardening:
  - Source indexing, retrieval evaluation hooks, prompt/answer separation, and clear AI-vs-source labeling in all outputs.
- Extensibility hooks (no marketplace build yet, but architecture-ready):
  - Buyer–supplier matching data model.
  - Inquiry / lead generation primitives.
  - Pluggable data-source connector interface so additional government portals, marketplaces, and directories can be added later.
- Documentation:
  - README and developer docs covering architecture, data model, how to add a new sector/attribute, how to add a new data source, and how AI/citations are handled.

### Exit Criteria

- The complete core workflow — Product Discovery → Research → Export Opportunity → Market Research → Supplier Discovery → Buyer Discovery → Recommendations → Sources — is demonstrable end-to-end.
- The codebase is modular enough that data sources, product categories, attributes, AI features, and future marketplace features can be expanded independently.

---

## Cross-Phase Principles

- **Modular architecture** with clean boundaries: frontend, backend/API, catalog data, external integrations, search/indexing, AI/recommendations, auth, citation management.
- **AI is never the sole source of truth** — retrieval-first, then analysis, with explicit source attribution.
- **All demo/sample data is clearly labeled**; no fabricated live trade, supplier, or buyer information.
- **Citations are inline**, not hidden in a generic sources page.
- **Authority is ranked** so users can judge trustworthiness at a glance.
- **Extensibility first** — new sectors, attributes, sources, and future marketplace features should not require rewrites.
