// Lightweight retrieval for the Q&A endpoint. Phase 2 keeps the index in
// SQLite (QaDocument rows); the retriever scores each document by keyword
// overlap with the question and returns the top N. A vector index can be
// layered on later (Phase 4 hardening) without changing the caller contract.

import { prisma } from "@/lib/prisma";

export type RetrievedDoc = {
  id: string;
  title: string;
  body: string;
  kind: string;
  score: number;
  matchedTerms: string[];
  source: {
    id: string;
    name: string;
    url: string | null;
    type: string;
    authority: string;
    retrievalDate: Date | null;
    notes: string | null;
  } | null;
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
  "have", "i", "in", "is", "it", "of", "on", "or", "that", "the", "this",
  "to", "was", "were", "will", "with", "you", "your", "do", "does", "can",
  "could", "should", "would", "any", "all", "some", "what", "which", "who",
  "how", "where", "when", "why", "their", "they", "them", "but", "if",
  "than", "so", "into", "out", "up", "down", "over", "under",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export async function retrieveDocs(
  question: string,
  opts: { topK?: number; kind?: string | null } = {},
): Promise<RetrievedDoc[]> {
  const topK = opts.topK ?? 5;
  const tokens = Array.from(new Set(tokenize(question)));
  if (tokens.length === 0) return [];

  const docs = await prisma.qaDocument.findMany({
    where: opts.kind ? { kind: opts.kind } : undefined,
    include: { source: true },
  });

  const scored: RetrievedDoc[] = [];
  for (const d of docs) {
    const haystack = (
      d.title +
      "\n" +
      d.body +
      "\n" +
      (d.tags ?? "")
    ).toLowerCase();
    const matched: string[] = [];
    let score = 0;
    for (const t of tokens) {
      // Count occurrences in the haystack. Capped so a long doc with 1,000
      // mentions of "india" doesn't dominate just by length.
      const re = new RegExp(`\\b${escapeRegex(t)}\\b`, "g");
      const matches = haystack.match(re);
      const n = matches ? matches.length : 0;
      if (n > 0) {
        matched.push(t);
        score += Math.min(n, 3);
      }
    }
    // Title hits count more than body hits.
    const titleHits = tokens.filter((t) => d.title.toLowerCase().includes(t));
    score += titleHits.length * 2;
    if (score > 0) {
      scored.push({
        id: d.id,
        title: d.title,
        body: d.body,
        kind: d.kind,
        score,
        matchedTerms: matched,
        source: d.source
          ? {
              id: d.source.id,
              name: d.source.name,
              url: d.source.url,
              type: d.source.type,
              authority: d.source.authority,
              retrievalDate: d.source.retrievalDate,
              notes: d.source.notes,
            }
          : null,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Compose a short, cited answer from retrieved docs. We deliberately do NOT
// call an LLM here — every sentence in the response is either a quoted snippet
// from a retrieved document or a templated summary line that names the docs
// it draws from. This keeps Phase 2's "grounded, no fabrication" promise
// without a model API key.
export function composeAnswer(
  question: string,
  docs: RetrievedDoc[],
): { answer: string; citations: RetrievedDoc[] } {
  if (docs.length === 0) {
    return {
      answer:
        "I couldn't find a close match in the indexed research. Try a more specific question (a product name, a country, or a compliance topic), or browse the Sectors and Products pages directly.",
      citations: [],
    };
  }

  const top = docs[0];
  const others = docs.slice(1);
  const otherTitles = others
    .slice(0, 3)
    .map((d) => `"${d.title}"`)
    .join(", ");

  const lines: string[] = [];
  lines.push(
    `Best match in the research index: "${top.title}" (score ${top.score}, matched on: ${top.matchedTerms.join(", ")}).`,
  );
  lines.push("");
  lines.push(top.body.trim());
  if (otherTitles) {
    lines.push("");
    lines.push(`Related notes: ${otherTitles}.`);
  }
  lines.push("");
  lines.push(
    "Every claim above is drawn from the cited source documents shown below. This is a retrieval-only response — no language model is generating new facts.",
  );

  return { answer: lines.join("\n"), citations: docs };
}
