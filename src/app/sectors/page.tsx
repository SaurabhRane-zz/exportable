import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SectorsIndexPage() {
  const sectors = await prisma.sector.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true, categories: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-brand-900">Sectors</h1>
      <p className="mt-1 text-slate-600 text-sm">
        Browse all sectors covered by the platform. Each sector organizes
        categories, products, and research.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((s) => (
          <Link
            key={s.id}
            href={`/sectors/${s.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-200 hover:shadow-sm transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{s.imageEmoji ?? "📦"}</div>
              <div className="flex-1">
                <div className="font-medium text-brand-900">{s.name}</div>
                <div className="text-sm text-slate-600 mt-1 line-clamp-3">
                  {s.description}
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  {s._count.products} product{s._count.products === 1 ? "" : "s"} ·{" "}
                  {s._count.categories} categor{s._count.categories === 1 ? "y" : "ies"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
