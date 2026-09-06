import Link from "next/link";
import { SourceList } from "@/components/SourceList";
import { retrieveDocs, composeAnswer } from "@/lib/qa";

type SP = { [k: string]: string | undefined };

const SUGGESTIONS = [
  "Which handicrafts have good export potential with low capital?",
  "Find Indian manufacturers for eco-friendly packaging.",
  "What certifications are required to export food products to Germany?",
  "Where can I find Japanese buyers for Indian handicrafts?",
  "What is REACH compliance for Indian chemical exporters?",
  "What is APEDA and how do I register as an agricultural exporter?",
];

export default async function AskPage({ searchParams }: { searchParams: SP }) {
  const question = searchParams.q?.trim() ?? "";
  const kind = searchParams.kind?.trim() || undefined;

  let answer: string | null = null;
  let citations: Awaited<ReturnType<typeof retrieveDocs>> = [];
  if (question) {
    citations = await retrieveDocs(question, { topK: 5, kind: kind || null });
    answer = composeAnswer(question, citations).answer;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-brand-900">Ask a research question</h1>
        <p className="mt-1 text-slate-600 text-sm">
          Ask anything about Indian exportable products, supplier discovery,
          overseas buyers, or destination compliance. The answer is drawn from
          the indexed source documents below — every claim is cited, retrieval
          date and authority level are visible. Phase 2 is retrieval-only: no
          language model is generating new facts.
        </p>
      </header>

      <form action="/ask" method="get" className="rounded-xl border border-slate-200 bg-white p-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-slate-500">Your question</span>
          <textarea
            name="q"
            defaultValue={question}
            rows={3}
            placeholder="e.g. Which handicrafts have good export potential with low capital?"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-slate-500">Topic filter (optional)</span>
            <select
              name="kind"
              defaultValue={kind ?? ""}
              className="mt-1 block w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Any topic</option>
              <option value="OVERVIEW">Overview</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="MARKET">Market</option>
              <option value="SUPPLIER">Supplier</option>
              <option value="BUYER">Buyer</option>
              <option value="GENERAL">General</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700"
            >
              Ask
            </button>
            <Link
              href="/ask"
              className="rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {question && answer !== null && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-brand-900">Answer</h2>
          <p className="mt-1 text-xs text-slate-500">Question: {question}</p>
          <div className="mt-3 text-sm text-slate-800 whitespace-pre-line">
            {answer}
          </div>
        </section>
      )}

      {question && citations.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-brand-900">Cited sources</h2>
          <p className="mt-1 text-xs text-slate-500">
            Ranked by authority. AI-derived notes are clearly distinguished
            from sourced facts.
          </p>
          <div className="mt-3">
            <SourceList
              items={citations
                .filter((c) => c.source)
                .map((c) => ({
                  source: c.source!,
                  reference: c.title,
                  factKind: "SOURCED",
                }))}
            />
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-brand-900">Try one of these</h2>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <Link
                href={`/ask?q=${encodeURIComponent(s)}`}
                className="block rounded-lg border border-slate-200 p-3 text-sm text-brand-700 hover:underline"
              >
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Phase 2 retrieval uses keyword scoring over the indexed Q&amp;A
        documents. Every answer is composed from quoted snippets and never
        invents a fact. Phase 4 will layer a vector index and a properly
        separated prompt/answer pipeline for higher recall.
      </div>
    </div>
  );
}
