import type { SocialProviders } from './types';

/** Next.js augments `RequestInit` with `next`; typed loosely here so the
 *  package still builds standalone (outside a Next app). */
type FetchInit = RequestInit & { next?: { revalidate?: number } };

/**
 * Server-side fetch of which social providers Huudis has configured.
 *
 * Call this in the auth page's **Server Component** and pass the result
 * to `<AuthForm providers={...} />`. Resolving provider status on the
 * server means the SSR HTML already carries the correct set of social
 * buttons — no client-fetch "flash" where disabled providers (Apple,
 * Facebook) appear for a moment and then vanish.
 *
 * Fails open: on any network/parse error it returns `{}`, which the
 * form treats as "show all" — matching `AuthForm`'s fail-open default,
 * so a transient blip degrades to the old behaviour rather than hiding
 * a working login.
 *
 * @param huudisBaseUrl  e.g. `https://huudis.com` (the product's `HUUDIS_ISSUER`).
 * @param opts.revalidate  ISR cache window in seconds; default 300.
 */
export async function fetchSocialProviders(
  huudisBaseUrl: string,
  opts: { revalidate?: number } = {},
): Promise<SocialProviders> {
  try {
    const base = huudisBaseUrl.replace(/\/+$/, '');
    const init: FetchInit = { next: { revalidate: opts.revalidate ?? 300 } };
    const res = await fetch(`${base}/api/v1/auth/providers`, init);
    if (!res.ok) return {};
    const body = (await res.json()) as { data?: SocialProviders };
    return body.data ?? {};
  } catch {
    return {};
  }
}
