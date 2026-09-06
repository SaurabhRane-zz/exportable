import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  const sectors = await p.sector.count();
  const products = await p.product.count();
  const sources = await p.source.count();
  const attrs = await p.specializedAttribute.count();
  const productSources = await p.productSource.count();
  const productsWithSources = await p.product.count({ where: { sources: { some: {} } } });
  const sample = await p.product.findMany({
    take: 5,
    include: { sector: true, sources: { include: { source: true } } },
    orderBy: { name: "asc" },
  });
  console.log(
    JSON.stringify(
      {
        sectors,
        products,
        sources,
        specializedAttributes: attrs,
        productSources,
        productsWithSources,
        sample: sample.map((x) => ({
          name: x.name,
          sector: x.sector.name,
          hsCode: x.hsCode,
          capital: x.capitalLevel,
          demand: x.exportDemand,
          sourceCount: x.sources.length,
          sources: x.sources.map((s) => ({
            name: s.source.name,
            kind: s.factKind,
            ref: s.reference,
          })),
        })),
      },
      null,
      2
    )
  );
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
