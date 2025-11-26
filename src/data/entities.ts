import { EntityDescription } from "../types";

// 24 entities, 1-based indexing. Monsters are 1–6, objects 7–24.
export const entityDescriptions: Array<EntityDescription | null> = [
  null,
  { prefix: "n evil", suffix: " wizard " },
  { prefix: " fiery", suffix: " demon " },
  { prefix: "n axe wielding", suffix: " troll " },
  { prefix: " fire breathing", suffix: " dragon " },
  { prefix: " giant", suffix: " bat " },
  { prefix: "n old and gnarled", suffix: " dwarf " },
  { prefix: " gold", suffix: " coin " },
  { prefix: " useful looking", suffix: " compass " },
  { prefix: " home made", suffix: " bomb " },
  { prefix: " blood red", suffix: " ruby " },
  { prefix: " sparkling", suffix: " diamond " },
  { prefix: " moon-like", suffix: " pearl " },
  { prefix: "n interesting", suffix: " stone " },
  { prefix: " diamond studded", suffix: " ring " },
  { prefix: " magic", suffix: " pendant " },
  { prefix: " most holy", suffix: " grail " },
  { prefix: " mirror like", suffix: " shield " },
  { prefix: " nondescript black", suffix: " box " },
  { prefix: "n old an rusty", suffix: " key " },
  { prefix: " double bladed", suffix: " sword " },
  { prefix: " small", suffix: " candle " },
  { prefix: " thin and tatty", suffix: " rope " },
  { prefix: " red house", suffix: " brick " },
  { prefix: " rusty ventilation", suffix: " grill " },
];

export function describeEntity(index: number): string {
  const entry = entityDescriptions[index];
  if (!entry) return "";
  return `a${entry.prefix}${entry.suffix}`;
}
