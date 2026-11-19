/**
 * Where to send someone after they sign in: `return_to` only when it stays
 * on this site, else `fallback`.
 *
 * A "starts with one slash" test is not enough: browsers read "/\evil.com"
 * (and "/\t/evil.com", the tab stripped) as "//evil.com", another site. So
 * backslashes and control characters are refused outright, and what is left
 * must resolve to this origin (`new URL(raw, origin).origin === origin`),
 * which also turns away "//evil.com", "https://evil.com" and "javascript:".
 *
 * `origin` defaults to the page's own; without one (server render) only a
 * same-site path is accepted.
 */
export function safeReturnTo(
  raw: string | null | undefined,
  fallback: string,
  origin: string | undefined = typeof window !== 'undefined' ? window.location.origin : undefined,
): string {
  if (!raw) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(raw)) return fallback;
  if (!origin) return raw.startsWith('/') && !raw.startsWith('//') ? raw : fallback;
  try {
    return new URL(raw, origin).origin === origin ? raw : fallback;
  } catch {
    return fallback;
  }
}
