import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-5 text-slate-700">
      <h1 className="text-2xl font-semibold text-brand-900">About Exportable</h1>
      <p>
        Exportable is a research and discovery platform for aspiring and
        existing Indian exporters. It organises the universe of Indian
        exportable products by sector, surfaces research on each product,
        supports natural-language research questions, and helps find Indian
        manufacturers and overseas buyers with cited, evidence-grounded
        information.
      </p>
      <h2 className="text-lg font-semibold text-brand-900">What&apos;s in this build (Phase 2)</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Structured search</strong> across products, Indian suppliers,
          and overseas buyers — by sector, country, capital, demand, and free-text
          keyword. See <Link className="text-brand-700 hover:underline" href="/search">/search</Link>.
        </li>
        <li>
          <strong>Natural-language research</strong>: ask questions in plain
          English and get a cited, evidence-grounded answer drawn from the
          indexed source documents. See{" "}
          <Link className="text-brand-700 hover:underline" href="/ask">/ask</Link>.
        </li>
        <li>
          <strong>Supplier and buyer discovery</strong>: a unified Companies
          view that distinguishes Indian suppliers from overseas buyers,
          surfaces data provenance (verified / public listing / inferred /
          AI-derived), and lists cited sources per company. See{" "}
          <Link className="text-brand-700 hover:underline" href="/companies">/companies</Link>.
        </li>
        <li>
          <strong>Product profile updates</strong>: each product profile now
          shows linked sample suppliers and buyers alongside compliance and
          sources.
        </li>
      </ul>
      <h2 className="text-lg font-semibold text-brand-900">Trust &amp; data policy</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>All quantitative fields in this build are <strong>sample data</strong>, not live trade statistics.</li>
        <li>No fabricated supplier, buyer, or company information is presented as real.</li>
        <li>Sources are ranked by authority. AI-derived notes are clearly labeled as such.</li>
        <li>
          When live data integrations are added, every fact will carry a source
          and a retrieval date.
        </li>
        <li>
          The natural-language Q&amp;A pipeline is retrieval-only: answers are
          composed from quoted snippets of indexed source documents. No
          language model is allowed to invent facts.
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
