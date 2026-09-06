import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SourceList } from "@/components/SourceList";
import {
  companyKindLabel,
  companyRelationLabel,
  dataProvenanceLabel,
  dataProvenanceTone,
} from "@/lib/company";

export default async function CompanyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: {
      sector: true,
      products: {
        include: { product: { include: { sector: true } } },
        orderBy: { product: { name: "asc" } },
      },
      sources: { include: { source: true } },
    },
  });
  if (!company) notFound();

  const tone = dataProvenanceTone(company.dataProvenance);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/companies" className="hover:text-brand-700">Companies</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{company.name}</span>
      </nav>

      <header className="mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl">{company.sector?.imageEmoji ?? "🏢"}</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-brand-900">
            {company.name}
          </h1>
          <span className="text-xs rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-2 py-0.5">
            {companyKindLabel(company.kind)}
          </span>
          <span
            className={`text-xs rounded-full border px-2 py-0.5 ${
              tone === "good"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : tone === "warn"
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-slate-300 bg-slate-50 text-slate-700"
            }`}
          >
            {dataProvenanceLabel(company.dataProvenance)}
          </span>
          {company.isSample && (
            <span className="text-xs rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2 py-0.5">
              Sample data
            </span>
          )}
        </div>
        <p className="mt-2 text-slate-700 max-w-3xl">
          {company.shortDescription ?? company.longDescription ?? ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          <Pill label="Country" value={`${company.countryName} (${company.country})`} />
          {company.state && <Pill label="Region" value={company.state} />}
          {company.city && <Pill label="City" value={company.city} />}
          {company.businessType && <Pill label="Type" value={company.businessType} />}
          {company.employeeBand && <Pill label="Employees" value={company.employeeBand} />}
          {company.annualRevenueBand && (
            <Pill label="Revenue" value={company.annualRevenueBand} />
          )}
          {company.yearEstablished && (
            <Pill label="Established" value={String(company.yearEstablished)} />
          )}
        </div>
      </header>

      {company.isSample && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This company profile is part of the Phase 2 sample dataset. Real
          supplier/buyer discovery requires a verified data integration (FIEO,
          EEPC, EPCH, MPEDA, JETRO, EBA, or equivalent). The structure
          (sources, provenance, retrieval date) is the production target; the
          record content is a placeholder.
        </div>
      )}

      <div className="mt-6 space-y-6">
        {company.longDescription && (
          <Section title="Overview">
            <p className="whitespace-pre-line">{company.longDescription}</p>
          </Section>
        )}

        <Section title="Contact & online presence">
          <ul className="text-sm text-slate-700 space-y-1">
            {company.website && (
              <li>
                Website:{" "}
                <a
                  className="text-brand-700 hover:underline"
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              </li>
            )}
            {company.email && <li>Email: {company.email}</li>}
            {company.phone && <li>Phone: {company.phone}</li>}
            {company.marketplaceUrl && (
              <li>
                Marketplace profile:{" "}
                <a
                  className="text-brand-700 hover:underline"
                  href={company.marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.marketplaceUrl}
                </a>
              </li>
            )}
            {!company.website && !company.email && !company.phone && !company.marketplaceUrl && (
              <li className="text-slate-500">
                No public contact details attached yet. Add via a verified
                directory pull.
              </li>
            )}
          </ul>
        </Section>

        {company.certifications && (
          <Section title="Certifications">
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
              {company.certifications
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((c) => (
                  <li key={c}>{c}</li>
                ))}
            </ul>
          </Section>
        )}

        {company.specialties && (
          <Section title="Specialties">
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
              {company.specialties
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((c) => (
                  <li key={c}>{c}</li>
                ))}
            </ul>
          </Section>
        )}

        {company.kind === "SUPPLIER" && company.targetMarkets && (
          <Section title="Target markets (where this supplier currently sells)">
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
              {company.targetMarkets
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((c) => (
                  <li key={c}>{c}</li>
                ))}
            </ul>
          </Section>
        )}
        {company.kind === "BUYER" && company.sourcingMarkets && (
          <Section title="Sourcing markets (where this buyer currently buys from)">
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
              {company.sourcingMarkets
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((c) => (
                  <li key={c}>{c}</li>
                ))}
            </ul>
          </Section>
        )}

        <Section
          title={`Linked products (${company.products.length})`}
        >
          {company.products.length === 0 ? (
            <p className="text-sm text-slate-500">
              No products linked to this company yet. The discovery pipeline
              can populate this once a verified directory pull maps the
              company to the catalog.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {company.products.map((cp) => (
                <li
                  key={cp.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    {companyRelationLabel(cp.relation)} · {cp.product.sector.name}
                  </div>
                  <Link
                    href={`/products/${cp.product.slug}`}
                    className="font-medium text-brand-900 hover:underline text-sm"
                  >
                    {cp.product.name}
                  </Link>
                  {cp.product.hsCode && (
                    <span className="ml-2 text-xs text-slate-500">
                      HS {cp.product.hsCode}
                    </span>
                  )}
                  {cp.notes && (
                    <p className="text-xs text-slate-600 mt-1">{cp.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Sources & citations">
          <SourceList
            items={company.sources.map((cs) => ({
              source: cs.source,
              reference: cs.reference,
              factKind: cs.factKind,
            }))}
          />
        </Section>

        <Section title="What's next">
          <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
            <li>
              <strong>Phase 3</strong> — comparative evaluation and ranked
              recommendations will surface this company inside product-level
              "Find suppliers" and "Find buyers" panels.
            </li>
            <li>
              <strong>Phase 4</strong> — connection pathways (marketplace
              listings, FIEO/ECGC trade-event channels, sample outreach
              templates) and inquiry primitives will be wired up here.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-brand-900">{title}</h2>
      <div className="mt-3 space-y-2 text-sm text-slate-700">{children}</div>
    </section>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 px-2 py-0.5">
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
