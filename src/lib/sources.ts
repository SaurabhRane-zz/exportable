// Application-layer constants for source types and authority levels.
// Stored as strings in SQLite (Prisma + SQLite doesn't support enums).

export const SOURCE_TYPES = [
  "GOVERNMENT",
  "INDUSTRY_BODY",
  "DIRECTORY",
  "MARKETPLACE",
  "THIRD_PARTY",
  "AI_DERIVED",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const AUTHORITY_LEVELS = [
  "L1_OFFICIAL",
  "L2_INDUSTRY",
  "L3_DIRECTORY",
  "L4_MARKETPLACE",
  "L5_THIRD_PARTY",
  "L6_AI_DERIVED",
] as const;
export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];

export function authorityLabel(a: string): string {
  switch (a) {
    case "L1_OFFICIAL":
      return "Official";
    case "L2_INDUSTRY":
      return "Industry body";
    case "L3_DIRECTORY":
      return "Directory";
    case "L4_MARKETPLACE":
      return "Marketplace";
    case "L5_THIRD_PARTY":
      return "Third-party";
    case "L6_AI_DERIVED":
      return "AI-derived";
    default:
      return a;
  }
}

export function authorityOrder(a: string): number {
  const i = AUTHORITY_LEVELS.indexOf(a as AuthorityLevel);
  return i === -1 ? 99 : i;
}

export function sourceTypeLabel(t: string): string {
  switch (t) {
    case "GOVERNMENT":
      return "Government";
    case "INDUSTRY_BODY":
      return "Industry body";
    case "DIRECTORY":
      return "Directory";
    case "MARKETPLACE":
      return "Marketplace";
    case "THIRD_PARTY":
      return "Third-party";
    case "AI_DERIVED":
      return "AI-derived";
    default:
      return t;
  }
}
