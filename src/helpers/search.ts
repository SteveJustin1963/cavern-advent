// BASIC SEARCH returns 0 or (index + 1)
export function search(haystack: string, needle: string): number {
  const idx = haystack.indexOf(needle);
  return idx >= 0 ? idx + 1 : 0;
}
