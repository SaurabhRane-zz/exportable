import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { companyKindLabel, dataProvenanceLabel } from "@/lib/company";

export const dynamic = "force-dynamic";

type SP = { [k: string]: string | undefined };

export default async function CompaniesIndexPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const kind = (searchParams.kind as "SUPPLIER" | "BUYER" | undefined) ?? undefined;
  const sector = searchParams.sector || undefined;
  const country = searchParams.country?.toUpperCase() || undefined;

  const where: any = { AND: [] as any[] };
  if (kind) where.AND.push({ kind });
  if (sector) where.AND.push({ sector: { slug: sector } });
  if (country) where.AND.push({ country });
  if (where.AND.length === 0) delete where.AND;

  const [sectors, companies] = await Promise.all([
    prisma.sector.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
    prisma.company.findMany({
      where,
      include: { sector: true, _count: { select: { products: true } } },
      orderBy: [{ kind: "asc" }, { countryName: "asc" }, { name: "asc" }],
    }),
  ]);

  const suppliers = companies.filter((c) => c.kind === "SUPPLIER");
  const buyers = companies.filter((c) => c.kind === "BUYER");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-brand-900">Companies</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Unified view of Indian suppliers and overseas buyers. Use the filters
          to narrow by sector, country, or company type. Each profile lists the
          sources it draws from with their authority ranking.
        </p>
      </header>

      <form
        action="/companies"
        method="get"
        className="rounded-xl border border-slate-200 bg-white p-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Type</span>
          <select
            name="kind"
            defaultValue={kind ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">All</option>
            <option value="SUPPLIER">Indian suppliers</option>
            <option value="BUYER">Overseas buyers</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Sector</span>
          <select
            name="sector"
            defaultValue={sector ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">All sectors</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Country (ISO-2)</span>
          <input
            type="text"
            name="country"
            defaultValue={country ?? ""}
            placeholder="e.g. IN, DE, US, GB"
            maxLength={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase"
          />
        </label>
        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700"
          >
            Apply
          </button>
          <Link
            href="/companies"
            className="rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Reset
          </Link>
        </div>
      </form>

      <Group title={`Indian suppliers (${suppliers.length})`} companies={suppliers} />
      <Group title={`Overseas buyers (${buyers.length})`} companies={buyers} />

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        All company profiles in this Phase 2 build are <strong>clearly-labeled
        sample data</strong>. Real supplier/buyer discovery requires a verified
        data integration (FIEO member directory, EEPC, EPCH, MPEDA, JETRO, EBA
        directories). Production data will flow through the same models with
        <code className="px-1">isSample=false</code> and a proper
        <code className="px-1">retrievalDate</code> on each source.
      </div>
    </div>
  );
}

function Group({
  title,
  companies,
}: {
  title: string;
  companies: Array<{
    id: string;
    slug: string;
    name: string;
    kind: string;
    shortDescription: string | null;
    country: string;
    countryName: string;
    state: string | null;
    city: string | null;
    businessType: string | null;
    dataProvenance: string;
    sector: { name: string; imageEmoji: string | null } | null;
    _count: { products: number };
  }>;
}) {
  if (companies.length === 0) return null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-brand-900">{title}</h2>
      <ul className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {companies.map((c) => (
          <li key={c.id}>
            <Link
              href={`/companies/${c.slug}`}
              className="block rounded-lg border border-slate-200 p-3 hover:border-brand-200 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">{c.sector?.imageEmoji ?? "🏢"}</span>
                <span className="font-medium text-brand-900">{c.name}</span>
                <span className="text-xs rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-2 py-0.5">
                  {companyKindLabel(c.kind)}
                </span>
                <span className="text-xs rounded-full border border-amber-200 bg-amber-50 text-amber-800 px-2 py-0.5">
                  {dataProvenanceLabel(c.dataProvenance)}
                </span>
              </div>
              {c.shortDescription && (
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                  {c.shortDescription}
                </p>
              )}
              <div className="mt-1 text-xs text-slate-500">
                {c.city ? `${c.city}, ` : ""}
                {c.state ? `${c.state}, ` : ""}
                {c.countryName} ({c.country})
                {c.businessType ? ` · ${c.businessType}` : ""}
                {c._count.products > 0
                  ? ` · ${c._count.products} linked product${c._count.products === 1 ? "" : "s"}`
                  : ""}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
