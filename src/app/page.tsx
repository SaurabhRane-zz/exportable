import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [sectorCount, productCount, sourceCount] = await Promise.all([
    prisma.sector.count(),
    prisma.product.count(),
    prisma.source.count(),
  ]);

  const sectors = await prisma.sector.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    take: 8,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-8">
        <span className="inline-block text-xs uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
          Phase 1 · MVP
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-brand-900">
          Research Indian exportable products.
          <br className="hidden sm:block" />
          Find manufacturers. Find buyers.
        </h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          A starting point for aspiring and existing Indian exporters — a
          sector-wise catalog of exportable products with research, indicative
          data, and source citations. Suppliers, buyers, and natural-language
          research arrive in the next phases.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/sectors"
            className="inline-flex items-center rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700"
          >
            Browse sectors
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg border border-brand-200 bg-white text-brand-700 px-4 py-2 text-sm font-medium hover:bg-brand-50"
          >
            Browse all products
          </Link>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-4 max-w-md">
          <Stat label="Sectors" value={sectorCount} />
          <Stat label="Products" value={productCount} />
          <Stat label="Sources" value={sourceCount} />
        </dl>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-brand-900">Featured sectors</h2>
          <Link href="/sectors" className="text-sm text-brand-700 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((s) => (
            <Link
              key={s.id}
              href={`/sectors/${s.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-200 hover:shadow-sm transition"
            >
              <div className="text-2xl">{s.imageEmoji ?? "📦"}</div>
              <div className="mt-2 font-medium text-brand-900">{s.name}</div>
              <div className="text-sm text-slate-600 line-clamp-2">{s.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Demo data notice.</strong> All product profiles, suppliers,
        buyers, and statistics in this Phase 1 MVP are clearly-labeled sample
        content. No live trade, supplier, or buyer information is fabricated.
        Sources, where listed, are real reference points that will be integrated
        with live retrieval in later phases.
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white border border-brand-100 p-3">
      <div className="text-2xl font-semibold text-brand-900">{value}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
