import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-5 text-slate-700">
      <h1 className="text-2xl font-semibold text-brand-900">About Exportable</h1>
      <p>
        Exportable is a research and discovery platform for aspiring and
        existing Indian exporters. It organises the universe of Indian
        exportable products by sector, surfaces research on each product, and —
        in later phases — helps find Indian manufacturers and overseas buyers
        with cited, evidence-grounded information.
      </p>
      <h2 className="text-lg font-semibold text-brand-900">What's in this build</h2>
      <p>
        This is <strong>Phase 1 (MVP)</strong>. It delivers a flexible
        sector-wise catalog, a comprehensive product profile with citations,
        and a clearly-labeled data model that allows new sectors, categories,
        and specialized attributes to be added without code changes. Natural
        language research, supplier/buyer discovery, and the recommendation
        engine arrive in later phases.
      </p>
      <h2 className="text-lg font-semibold text-brand-900">Trust & data policy</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>All quantitative fields in this build are <strong>sample data</strong>, not live trade statistics.</li>
        <li>No fabricated supplier, buyer, or company information is presented as real.</li>
        <li>Sources are ranked by authority. AI-derived notes are clearly labeled as such.</li>
        <li>
          When live data integrations are added, every fact will carry a source
          and a retrieval date.
        </li>
      </ul>
      <p>
        <Link href="/sectors" className="text-brand-700 hover:underline">
          Browse the catalog →
        </Link>
      </p>
    </div>
  );
}
