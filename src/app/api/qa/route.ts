// JSON API for the Q&A pipeline. Same retrieval the /ask page uses, exposed
// as a POST endpoint so it can be wired into the Phase 3 recommendation
// engine and any external client (e.g. a CLI, a Slack bot, an extension).

import { NextRequest, NextResponse } from "next/server";
import { composeAnswer, retrieveDocs } from "@/lib/qa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  question?: string;
  topK?: number;
  kind?: string;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const question = (body.question ?? "").trim();
  if (!question) {
    return NextResponse.json(
      { error: "Missing 'question' in request body" },
      { status: 400 },
    );
  }
  const topK = Math.max(1, Math.min(10, body.topK ?? 5));
  const kind = body.kind && body.kind.trim() ? body.kind.trim() : null;

  const docs = await retrieveDocs(question, { topK, kind });
  const composed = composeAnswer(question, docs);
  return NextResponse.json({
    question,
    kind,
    answer: composed.answer,
    citations: docs.map((d) => ({
      id: d.id,
      title: d.title,
      kind: d.kind,
      score: d.score,
      matchedTerms: d.matchedTerms,
      source: d.source,
    })),
  });
}
