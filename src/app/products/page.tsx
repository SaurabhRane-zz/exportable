import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsIndexPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sector: { order: "asc" } }, { name: "asc" }],
    include: { sector: true },
  });

  // group by sector for a tidy listing
  const bySector = new Map<string, { sector: typeof products[0]["sector"]; items: typeof products }>();
  for (const p of products) {
    const arr = bySector.get(p.sectorId)?.items ?? [];
    arr.push(p);
    if (!bySector.has(p.sectorId)) {
      bySector.set(p.sectorId, { sector: p.sector, items: arr });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-brand-900">All products</h1>
      <p className="mt-1 text-slate-600 text-sm">
        Every product in the catalog with an Indian export HS code. Click any
        product for the full research profile.
      </p>

      <div className="mt-6 space-y-6">
        {[...bySector.values()].map((g) => (
          <section key={g.sector.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{g.sector.imageEmoji ?? "📦"}</span>
              <Link
                href={`/sectors/${g.sector.slug}`}
                className="font-medium text-brand-900 hover:underline"
              >
                {g.sector.name}
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
              {g.items.map((p) => (
                <li key={p.id} className="text-sm">
                  <Link href={`/products/${p.slug}`} className="text-brand-700 hover:underline">
                    {p.name}
                  </Link>{" "}
                  <span className="text-slate-400">HS {p.hsCode ?? "—"}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
