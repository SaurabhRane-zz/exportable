import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListBlock, ProductSummary, Section } from "@/components/ProductBlocks";
import { SourceList } from "@/components/SourceList";
import {
  companyRelationLabel,
  dataProvenanceLabel,
} from "@/lib/company";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      sector: true,
      category: true,
      subcategory: true,
      sources: { include: { source: true } },
      companies: {
        include: { company: true },
        orderBy: [{ company: { kind: "asc" } }, { company: { name: "asc" } }],
      },
    },
  });
  if (!product) notFound();

  // Specialized attributes attached directly to this product
  const productAttrs = await prisma.specializedAttributeValue.findMany({
    where: { productId: product.id },
    include: { attribute: true },
  });

  // Inherited from category (illustrative — Phase 1 only attaches a small set)
  let categoryAttrs: { attribute: { label: string; valueType: string; group: string | null }; valueBool: boolean | null; valueText: string | null; valueNumber: number | null; regionCode: string | null }[] = [];
  if (product.categoryId) {
    categoryAttrs = await prisma.specializedAttributeValue.findMany({
      where: { categoryId: product.categoryId },
      include: { attribute: true },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/sectors" className="hover:text-brand-700">Sectors</Link>
        <span className="mx-2">/</span>
        <Link href={`/sectors/${product.sector.slug}`} className="hover:text-brand-700">
          {product.sector.name}
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{product.category.name}</span>
          </>
        )}
      </nav>

      <header className="mt-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{product.sector.imageEmoji ?? "📦"}</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-brand-900">
            {product.name}
          </h1>
          {product.isSample && (
            <span className="text-xs rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2 py-0.5">
              Sample data
            </span>
          )}
        </div>
        <p className="mt-2 text-slate-700 max-w-3xl">{product.shortDescription}</p>
        <div className="mt-4">
          <ProductSummary product={product} />
        </div>
      </header>

      {product.isSample && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This product profile is part of the Phase 1 demo dataset. All
          quantitative fields (HS code, indicative pricing, demand, competition,
          target markets) are reasonable references but are not live trade
          statistics. Sources cited below are real reference points to be
          integrated with live retrieval in a later phase.
        </div>
      )}

      <div className="mt-6 space-y-6">
        {product.longDescription && (
          <Section title="Overview">
            <p className="whitespace-pre-line">{product.longDescription}</p>
          </Section>
        )}

        <Section title="Export opportunity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ListBlock title="Applications / use cases" items={product.applications} />
            <ListBlock title="Typical buyers" items={product.typicalBuyers} />
            <ListBlock title="Target industries" items={product.targetIndustries} />
            <ListBlock title="Target markets" items={product.targetMarkets} />
          </div>
        </Section>

        <Section title="Compliance & specialized attributes">
          {productAttrs.length === 0 && categoryAttrs.length === 0 ? (
            <p className="text-sm text-slate-500">
              No specialized attributes attached to this product yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productAttrs.map((v) => (
                <AttributeRow key={v.id} v={v} />
              ))}
              {categoryAttrs.map((v) => (
                <AttributeRow
                  key={`c-${v.attribute.label}-${v.regionCode ?? ""}`}
                  v={v as any}
                  inheritedFrom="category"
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Recommendations (preview)">
          <p className="text-sm text-slate-700">
            <strong>Where to validate first.</strong>{" "}
            {product.hsCode
              ? `Cross-check HS ${product.hsCode} at the official DGCI&S commodity-wise export portal for current volumes and top destinations.`
              : "Confirm the appropriate HS code at the official DGCI&S commodity-wise export portal before approaching buyers."}{" "}
            Shortlist the top 3 markets from the list above and look for
            importers/distributors in the relevant country before initiating
            outreach.
          </p>
          <p className="text-xs text-slate-500">
            Recommendation engine with explainable, evidence-grounded
            recommendations arrives in Phase 3.
          </p>
        </Section>

        <CompaniesSection
          relations={product.companies.filter((c) => c.relation === "SUPPLIES")}
          title="Indian suppliers (sample)"
          emptyText="No sample Indian suppliers linked to this product yet."
        />
        <CompaniesSection
          relations={product.companies.filter((c) => c.relation === "SOURCES")}
          title="Overseas buyers (sample)"
          emptyText="No sample overseas buyers linked to this product yet."
        />

        <Section title="Sources & citations">
          <SourceList
            items={product.sources.map((ps) => ({
              source: ps.source,
              reference: ps.reference,
              factKind: ps.factKind,
            }))}
          />
        </Section>

        <Section title="What's next">
          <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
            <li>
              <strong>Phase 2</strong> — natural-language research questions,
              structured search, supplier & buyer discovery.
            </li>
            <li>
              <strong>Phase 3</strong> — ranked recommendations and comparative
              evaluation across products and markets.
            </li>
            <li>
              <strong>Phase 4</strong> — connection pathways and a future
              marketplace hook.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function CompaniesSection({
  relations,
  title,
  emptyText,
}: {
  relations: Array<{
    id: string;
    relation: string;
    company: {
      id: string;
      slug: string;
      name: string;
      shortDescription: string | null;
      country: string;
      countryName: string;
      dataProvenance: string;
    };
  }>;
  title: string;
  emptyText: string;
}) {
  return (
    <Section title={title}>
      {relations.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relations.map((cp) => (
            <li
              key={cp.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/companies/${cp.company.slug}`}
                  className="font-medium text-brand-900 hover:underline text-sm"
                >
                  {cp.company.name}
                </Link>
                <span className="text-xs rounded-full border border-slate-300 bg-white text-slate-700 px-2 py-0.5">
                  {companyRelationLabel(cp.relation)}
                </span>
                <span className="text-xs rounded-full border border-amber-200 bg-amber-50 text-amber-800 px-2 py-0.5">
                  {dataProvenanceLabel(cp.company.dataProvenance)}
                </span>
              </div>
              {cp.company.shortDescription && (
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {cp.company.shortDescription}
                </p>
              )}
              <div className="mt-1 text-xs text-slate-500">
                {cp.company.countryName} ({cp.company.country})
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function AttributeRow({
  v,
  inheritedFrom,
}: {
  v: {
    attribute: { label: string; valueType: string; group: string | null };
    valueBool: boolean | null;
    valueText: string | null;
    valueNumber: number | null;
    regionCode: string | null;
  };
  inheritedFrom?: "category";
}) {
  const display =
    v.valueBool !== null
      ? v.valueBool
        ? "Required / relevant"
        : "Not required"
      : v.valueText ?? (v.valueNumber !== null ? String(v.valueNumber) : "—");
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wider text-slate-500">
        {v.attribute.group ?? "Attribute"}
        {v.regionCode ? ` · ${v.regionCode}` : ""}
        {inheritedFrom ? ` · inherited from ${inheritedFrom}` : ""}
      </div>
      <div className="font-medium text-brand-900 text-sm">{v.attribute.label}</div>
      <div className="text-sm text-slate-700">{display}</div>
    </div>
  );
}
