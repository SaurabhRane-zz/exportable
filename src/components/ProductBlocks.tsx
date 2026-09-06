function Pill({ label, value, tone = "default" }: { label: string; value?: string | null; tone?: "default" | "good" | "warn" | "neutral" }) {
  if (!value) return null;
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "neutral"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : "border-brand-100 bg-brand-50 text-brand-800";
  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-75">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function demandTone(d?: string | null) {
  if (!d) return "neutral";
  if (d === "Very High" || d === "High") return "good";
  if (d === "Medium") return "default";
  return "warn";
}

export function ProductSummary({
  product,
}: {
  product: {
    hsCode: string | null;
    indicativePriceUsd: string | null;
    capitalLevel: string | null;
    exportDemand: string | null;
    competition: string | null;
  };
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Pill label="HS Code" value={product.hsCode ? `HS ${product.hsCode}` : null} />
      <Pill label="Indicative price" value={product.indicativePriceUsd} />
      <Pill label="Capital level" value={product.capitalLevel} tone={product.capitalLevel === "High" ? "warn" : "default"} />
      <Pill label="Export demand" value={product.exportDemand} tone={demandTone(product.exportDemand)} />
      <Pill label="Competition" value={product.competition} tone={product.competition === "High" ? "warn" : "default"} />
    </div>
  );
}

export function ListBlock({ title, items }: { title: string; items?: string | null }) {
  if (!items) return null;
  const list = items
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
      <ul className="mt-1 list-disc list-inside text-sm text-slate-700 space-y-0.5">
        {list.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-brand-900">{title}</h2>
      <div className="mt-3 space-y-4 text-sm text-slate-700">{children}</div>
    </section>
  );
}
