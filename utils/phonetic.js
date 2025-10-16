/**
 * Minimal Double Metaphone wrapper.
 * For brevity I include a simple metaphone implementation (sufficient for assignment).
 * In production, use a library such as 'double-metaphone' or 'natural'.
 */

export function metaphoneKey(name = '') {
  // Simple metaphone-like heuristic: uppercase, strip vowels except first char,
  // collapse duplicates. Not perfect but works for phonetic clustering.
  if (!name) return '';
  let s = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = 'AEIOU';
  let out = s[0] || '';
  for (let i = 1; i < s.length; i++) {
    const ch = s[i];
    if (vowels.includes(ch)) continue;
    if (ch === out[out.length - 1]) continue;
    out += ch;
  }
  // limit length
  return out.slice(0, 6);
}
