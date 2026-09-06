import { authorityLabel, authorityOrder, sourceTypeLabel } from "@/lib/sources";

type Item = {
  source: {
    id: string;
    name: string;
    url: string | null;
    type: string;
    authority: string;
    retrievalDate: Date | null;
    notes: string | null;
  };
  reference: string;
  factKind: string;
};

export function SourceList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No sources attached to this product yet.
      </p>
    );
  }
  // rank by authority, then by name
  const sorted = [...items].sort((a, b) => {
    const oa = authorityOrder(a.source.authority);
    const ob = authorityOrder(b.source.authority);
    if (oa !== ob) return oa - ob;
    return a.source.name.localeCompare(b.source.name);
  });
  return (
    <ul className="space-y-2">
      {sorted.map((it) => (
        <li
          key={`${it.source.id}-${it.reference}`}
          className="rounded-lg border border-slate-200 bg-white p-3"
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="font-medium text-brand-900 text-sm">
              {it.source.url ? (
                <a
                  href={it.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {it.source.name}
                </a>
              ) : (
                it.source.name
              )}
            </div>
            <div className="flex gap-2">
              <span
                className={`text-xs rounded-full px-2 py-0.5 border ${
                  it.factKind === "AI_DERIVED"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-emerald-300 bg-emerald-50 text-emerald-800"
                }`}
              >
                {it.factKind === "AI_DERIVED" ? "AI-derived" : "Sourced"}
              </span>
              <span className="text-xs rounded-full px-2 py-0.5 border border-slate-300 bg-slate-50 text-slate-700">
                {authorityLabel(it.source.authority)}
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-600">
            <span>{sourceTypeLabel(it.source.type)}</span>
            {it.reference && it.reference !== "—" && (
              <span> · {it.reference}</span>
            )}
            {it.source.retrievalDate && (
              <span>
                {" "}
                · retrieved{" "}
                {new Date(it.source.retrievalDate).toISOString().slice(0, 10)}
              </span>
            )}
          </div>
          {it.source.notes && (
            <div className="mt-1 text-xs text-slate-500">{it.source.notes}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
