import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SectorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const sector = await prisma.sector.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: {
          products: true,
          subcategories: { include: { products: true } },
        },
      },
      products: { take: 5, orderBy: { name: "asc" } },
    },
  });
  if (!sector) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/sectors" className="hover:text-brand-700">Sectors</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{sector.name}</span>
      </nav>
      <header className="mt-3 flex items-start gap-4">
        <div className="text-4xl">{sector.imageEmoji ?? "📦"}</div>
        <div>
          <h1 className="text-2xl font-semibold text-brand-900">{sector.name}</h1>
          <p className="mt-1 text-slate-600 max-w-2xl">{sector.description}</p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-brand-900">Categories</h2>
        {sector.categories.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            Categories for this sector will be added in a later phase.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {sector.categories.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-medium text-brand-900">{c.name}</div>
                {c.description && (
                  <div className="text-sm text-slate-600">{c.description}</div>
                )}
                {c.subcategories.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {c.subcategories.map((sc) => (
                      <div key={sc.id}>
                        <div className="text-sm font-medium text-slate-700">{sc.name}</div>
                        <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {sc.products.map((p) => (
                            <li key={p.id}>
                              <Link
                                href={`/products/${p.slug}`}
                                className="text-sm text-brand-700 hover:underline"
                              >
                                → {p.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {c.subcategories.length === 0 && c.products.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {c.products.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-sm text-brand-700 hover:underline"
                        >
                          → {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
