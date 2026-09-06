// Shared display + data-provenance helpers used across product, supplier, buyer,
// and Q&A pages. Centralising these keeps labels and tone consistent.

export const COMPANY_KINDS = ["SUPPLIER", "BUYER"] as const;
export type CompanyKind = (typeof COMPANY_KINDS)[number];

export const COMPANY_RELATIONS = [
  "SUPPLIES",
  "SELLS",
  "DISTRIBUTES",
  "SOURCES",
] as const;
export type CompanyRelation = (typeof COMPANY_RELATIONS)[number];

export const DATA_PROVENANCES = [
  "VERIFIED",
  "PUBLIC_LISTING",
  "INFERRED",
  "AI_DERIVED",
] as const;
export type DataProvenance = (typeof DATA_PROVENANCES)[number];

export function dataProvenanceLabel(p: string): string {
  switch (p) {
    case "VERIFIED":
      return "Verified";
    case "PUBLIC_LISTING":
      return "Public listing";
    case "INFERRED":
      return "Inferred";
    case "AI_DERIVED":
      return "AI-derived";
    default:
      return p;
  }
}

export function dataProvenanceTone(
  p: string,
): "good" | "warn" | "neutral" | "default" {
  switch (p) {
    case "VERIFIED":
      return "good";
    case "PUBLIC_LISTING":
      return "default";
    case "INFERRED":
      return "warn";
    case "AI_DERIVED":
      return "warn";
    default:
      return "neutral";
  }
}

export function companyKindLabel(k: string): string {
  switch (k) {
    case "SUPPLIER":
      return "Indian supplier";
    case "BUYER":
      return "Overseas buyer";
    default:
      return k;
  }
}

export function companyRelationLabel(r: string): string {
  switch (r) {
    case "SUPPLIES":
      return "Supplies";
    case "SELLS":
      return "Sells";
    case "DISTRIBUTES":
      return "Distributes";
    case "SOURCES":
      return "Sources from";
    default:
      return r;
  }
}

export const QA_KINDS = [
  "OVERVIEW",
  "COMPLIANCE",
  "MARKET",
  "SUPPLIER",
  "BUYER",
  "GENERAL",
] as const;
export type QaKind = (typeof QA_KINDS)[number];

export function qaKindLabel(k: string): string {
  switch (k) {
    case "OVERVIEW":
      return "Overview";
    case "COMPLIANCE":
      return "Compliance";
    case "MARKET":
      return "Market";
    case "SUPPLIER":
      return "Supplier";
    case "BUYER":
      return "Buyer";
    case "GENERAL":
      return "General";
    default:
      return k;
  }
}
