// Display names for printing (include correct article).
const entityNames: Array<string | null> = [
  null,
  "an evil wizard",
  "a fiery demon",
  "an axe wielding troll",
  "a fire breathing dragon",
  "a giant bat",
  "an old and gnarled dwarf",
  "a gold coin",
  "a useful looking compass",
  "a home made bomb",
  "a blood red ruby",
  "a sparkling diamond",
  "a moon-like pearl",
  "an interesting stone",
  "a diamond studded ring",
  "a magic pendant",
  "a most holy grail",
  "a mirror like shield",
  "a nondescript black box",
  "an old an rusty key",
  "a double bladed sword",
  "a small candle",
  "a thin and tatty rope",
  "a red house brick",
  "a rusty ventilation grill",
];

// Command nouns (suffixes) as used in BASIC DATA 184 (N1$) — trimmed, for whole-word matching.
const entityCommandNouns: Array<string | null> = [
  null,
  "wizard",
  "demon",
  "troll",
  "dragon",
  "bat",
  "dwarf",
  "coin",
  "compass",
  "bomb",
  "ruby",
  "diamond",
  "pearl",
  "stone",
  "ring",
  "pendant",
  "grail",
  "shield",
  "box",
  "key",
  "sword",
  "candle",
  "rope",
  "brick",
  "grill",
];

export function getEntityName(index: number): string {
  const name = entityNames[index];
  return name ?? "";
}

export function describeEntity(index: number): string {
  const name = getEntityName(index);
  if (!name) return "";
  return name;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchesEntityName(normalizedInput: string, index: number): boolean {
  const noun = entityCommandNouns[index];
  if (!noun) return false;
  const pattern = new RegExp(`\\b${escapeRegExp(noun)}\\b`, "i");
  return pattern.test(normalizedInput);
}
