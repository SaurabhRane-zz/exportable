// Server-side search for products, suppliers, and overseas buyers.
// Phase 2 uses case-insensitive substring matching on indexed fields plus
// structured filters (sector, country, kind, capital, demand). A vector
// index can be layered on later without changing the caller's contract.

import { prisma } from "@/lib/prisma";

export type SearchFilters = {
  q?: string;
  sector?: string;
  country?: string;
  kind?: "SUPPLIER" | "BUYER" | "" | undefined;
  capital?: string;
  demand?: string;
};

export type ProductResult = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  hsCode: string | null;
  capitalLevel: string | null;
  exportDemand: string | null;
  competition: string | null;
  sector: { id: string; slug: string; name: string; imageEmoji: string | null };
  category: { id: string; name: string } | null;
};

export type CompanyResult = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  kind: string;
  country: string;
  countryName: string;
  state: string | null;
  city: string | null;
  businessType: string | null;
  dataProvenance: string;
  sector: { id: string; slug: string; name: string; imageEmoji: string | null } | null;
  productCount: number;
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchProducts(
  f: SearchFilters,
): Promise<ProductResult[]> {
  const where: any = { AND: [] as any[] };
  if (f.q && f.q.trim()) {
    const re = new RegExp(escapeRegex(f.q.trim()), "i");
    where.AND.push({
      OR: [{ name: { contains: f.q.trim() } }, { shortDescription: { contains: f.q.trim() } }, { longDescription: { contains: f.q.trim() } }, { hsCode: { contains: f.q.trim() } }],
    });
    // Keep re referenced to avoid tree-shake linter complaints
    void re;
  }
  if (f.sector) where.AND.push({ sector: { slug: f.sector } });
  if (f.capital) where.AND.push({ capitalLevel: f.capital });
  if (f.demand) where.AND.push({ exportDemand: f.demand });
  if (where.AND.length === 0) delete where.AND;

  const rows = await prisma.product.findMany({
    where,
    include: { sector: true, category: true },
    orderBy: [{ sector: { order: "asc" } }, { name: "asc" }],
    take: 200,
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    hsCode: p.hsCode,
    capitalLevel: p.capitalLevel,
    exportDemand: p.exportDemand,
    competition: p.competition,
    sector: {
      id: p.sector.id,
      slug: p.sector.slug,
      name: p.sector.name,
      imageEmoji: p.sector.imageEmoji,
    },
    category: p.category ? { id: p.category.id, name: p.category.name } : null,
  }));
}

export async function searchCompanies(
  f: SearchFilters,
): Promise<CompanyResult[]> {
  const where: any = { AND: [] as any[] };
  if (f.kind) where.AND.push({ kind: f.kind });
  if (f.country) where.AND.push({ country: f.country.toUpperCase() });
  if (f.sector) where.AND.push({ sector: { slug: f.sector } });
  if (f.q && f.q.trim()) {
    where.AND.push({
      OR: [
        { name: { contains: f.q.trim() } },
        { shortDescription: { contains: f.q.trim() } },
        { longDescription: { contains: f.q.trim() } },
        { specialties: { contains: f.q.trim() } },
        { city: { contains: f.q.trim() } },
        { state: { contains: f.q.trim() } },
      ],
    });
  }
  if (where.AND.length === 0) delete where.AND;

  const rows = await prisma.company.findMany({
    where,
    include: { sector: true, _count: { select: { products: true } } },
    orderBy: [{ countryName: "asc" }, { name: "asc" }],
    take: 200,
  });
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    shortDescription: c.shortDescription,
    kind: c.kind,
    country: c.country,
    countryName: c.countryName,
    state: c.state,
    city: c.city,
    businessType: c.businessType,
    dataProvenance: c.dataProvenance,
    sector: c.sector
      ? {
          id: c.sector.id,
          slug: c.sector.slug,
          name: c.sector.name,
          imageEmoji: c.sector.imageEmoji,
        }
      : null,
    productCount: c._count.products,
  }));
}

export async function listFilterOptions() {
  const [sectors, countries] = await Promise.all([
    prisma.sector.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
    prisma.company.findMany({
      distinct: ["country"],
      select: { country: true, countryName: true },
      orderBy: { countryName: "asc" },
    }),
  ]);
  return { sectors, countries };
}
