import Link from "next/link";
import {
  listFilterOptions,
  searchCompanies,
  searchProducts,
  type SearchFilters,
} from "@/lib/search";
import { dataProvenanceLabel, companyKindLabel } from "@/lib/company";
import { authorityLabel } from "@/lib/sources";

type Search = { [k: string]: string | undefined };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const filters: SearchFilters = {
    q: searchParams.q?.trim() || undefined,
    sector: searchParams.sector || undefined,
    country: searchParams.country?.toUpperCase() || undefined,
    kind: (searchParams.kind as "SUPPLIER" | "BUYER" | undefined) || undefined,
    capital: searchParams.capital || undefined,
    demand: searchParams.demand || undefined,
  };
  const tab = searchParams.tab === "companies" ? "companies" : "products";

  const [{ sectors, countries }, products, companies] = await Promise.all([
    listFilterOptions(),
    searchProducts(filters),
    searchCompanies(filters),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-brand-900">Search</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Filter products, Indian suppliers, and overseas buyers by sector,
          country, capital, and demand. Free-text matches name, description,
          specialty, and HS code.
        </p>
      </header>

      <form
        action="/search"
        method="get"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <input type="hidden" name="tab" value={tab} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Keyword">
            <input
              type="text"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="e.g. turmeric, eco-friendly, REACH"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Sector">
            <select
              name="sector"
              defaultValue={filters.sector ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All sectors</option>
              {sectors.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country">
            <select
              name="country"
              defaultValue={filters.country ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.countryName} ({c.country})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Company type">
            <select
              name="kind"
              defaultValue={filters.kind ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All companies</option>
              <option value="SUPPLIER">Indian suppliers only</option>
              <option value="BUYER">Overseas buyers only</option>
            </select>
          </Field>
          <Field label="Capital level">
            <select
              name="capital"
              defaultValue={filters.capital ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Any</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </Field>
          <Field label="Export demand">
            <select
              name="demand"
              defaultValue={filters.demand ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Any</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </Field>
          <div className="flex items-end gap-2 sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700"
            >
              Search
            </button>
            <Link
              href="/search"
              className="rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="flex gap-2 border-b border-slate-200">
        <TabLink
          href={tabHref(searchParams, "products")}
          active={tab === "products"}
          label={`Products (${products.length})`}
        />
        <TabLink
          href={tabHref(searchParams, "companies")}
          active={tab === "companies"}
          label={`Companies (${companies.length})`}
        />
      </div>

      {tab === "products" ? (
        <ProductsResults products={products} />
      ) : (
        <CompaniesResults companies={companies} />
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        All company profiles shown here are <strong>sample data</strong>. The
        discovery module's structure (sources, provenance labels, retrieval
        dates) is real; the individual records are placeholders that production
        data integration will replace.
      </div>
    </div>
  );
}

function tabHref(params: Search, tab: "products" | "companies") {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === "tab") continue;
    if (v != null && v !== "") sp.set(k, v);
  }
  sp.set("tab", tab);
  return `/search?${sp.toString()}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TabLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm border-b-2 -mb-px ${
        active
          ? "border-brand-600 text-brand-800 font-medium"
          : "border-transparent text-slate-600 hover:text-brand-700"
      }`}
    >
      {label}
    </Link>
  );
}

function ProductsResults({ products }: { products: Awaited<ReturnType<typeof searchProducts>> }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-slate-500">No products match the current filters.</p>
    );
  }
  return (
    <ul className="space-y-3">
      {products.map((p) => (
        <li
          key={p.id}
          className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{p.sector.imageEmoji ?? "📦"}</span>
              <Link
                href={`/products/${p.slug}`}
                className="font-medium text-brand-900 hover:underline"
              >
                {p.name}
              </Link>
              {p.hsCode && (
                <span className="text-xs text-slate-500">HS {p.hsCode}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {p.shortDescription}
            </p>
            <div className="mt-1 text-xs text-slate-500">
              {p.sector.name}
              {p.category ? ` · ${p.category.name}` : ""}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {p.capitalLevel && <Tag label="Capital" value={p.capitalLevel} />}
            {p.exportDemand && <Tag label="Demand" value={p.exportDemand} />}
            {p.competition && <Tag label="Competition" value={p.competition} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

function CompaniesResults({ companies }: { companies: Awaited<ReturnType<typeof searchCompanies>> }) {
  if (companies.length === 0) {
    return (
      <p className="text-sm text-slate-500">No companies match the current filters.</p>
    );
  }
  return (
    <ul className="space-y-3">
      {companies.map((c) => (
        <li
          key={c.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/companies/${c.slug}`}
                  className="font-medium text-brand-900 hover:underline"
                >
                  {c.name}
                </Link>
                <span className="text-xs rounded-full border border-slate-300 bg-slate-50 text-slate-700 px-2 py-0.5">
                  {companyKindLabel(c.kind)}
                </span>
                <span className="text-xs rounded-full border border-amber-200 bg-amber-50 text-amber-800 px-2 py-0.5">
                  {dataProvenanceLabel(c.dataProvenance)}
                </span>
                {c.sector && (
                  <span className="text-xs text-slate-500">
                    {c.sector.name}
                  </span>
                )}
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
                {c.productCount > 0
                  ? ` · ${c.productCount} linked product${c.productCount === 1 ? "" : "s"}`
                  : ""}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 px-2 py-0.5">
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

// keep this import to satisfy tree-shake for authorityLabel, even if unused here
void authorityLabel;
