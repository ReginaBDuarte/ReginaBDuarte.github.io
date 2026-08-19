// A content value counts as an owed placeholder when it's still the literal
// [SQUARE BRACKET] token from the brief — e.g. "[FRAMEWORK NAME]", "[DATE]".
export function isPlaceholder(value: string): boolean {
  return /^\[.+\]$/.test(value.trim());
}
