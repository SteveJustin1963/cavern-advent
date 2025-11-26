/**
 * Mirror the BASIC input normalisation:
 * - pad with a space on both sides
 * - convert A–Z to lowercase, leave everything else untouched
 */
export function normalizeInput(raw: string): string {
  const padded = ` ${raw} `;
  let result = "";
  for (let i = 0; i < padded.length; i += 1) {
    const code = padded.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(code + 32);
    } else {
      result += padded[i];
    }
  }
  return result;
}
