'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { defaultEndpoints, type AuthEndpoints, type SocialProviders } from './types';

export interface AuthFormProps {
  mode: 'login' | 'signup';
  /** Display name shown in copy ("New to Plugipay?", "Welcome back"). */
  brand: string;
  /** Override the auth endpoint paths. Default matches Forjio family
   *  `@forjio/sdk/auth-handlers` mounts. */
  endpoints?: Partial<AuthEndpoints>;
  /** Which social providers to render. Host fetches the provider
   *  status; pass undefined to show all (fail-open). */
  providers?: SocialProviders | null;
  /** Default redirect target after a successful auth. Default
   *  `/dashboard`. Search-param `?return_to=` overrides at runtime. */
  defaultReturnTo?: string;
}

export function AuthForm({
  mode,
  brand,
  endpoints,
  providers,
  defaultReturnTo = '/dashboard',
}: AuthFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params?.get('return_to') || defaultReturnTo;
  const ssoError = params?.get('sso_error');
  const ssoDetail = params?.get('sso_detail');
  const ep: AuthEndpoints = { ...defaultEndpoints, ...endpoints };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    ssoError ? `Sign-in failed: ${ssoDetail || ssoError}` : null,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const path = mode === 'signup' ? ep.signup : ep.login;
      const body: Record<string, unknown> = { email, password };
      if (mode === 'signup' && name.trim()) body.name = name.trim();
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(payload?.error?.message ?? `Request failed (${res.status})`);
      }
      router.push(returnTo);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const otherMode = mode === 'login' ? 'signup' : 'login';
  const otherHref = `/${otherMode}?return_to=${encodeURIComponent(returnTo)}`;
  const socialUrl = (provider: 'google' | 'apple') =>
    `${ep.socialStart}?provider=${provider}&return_to=${encodeURIComponent(returnTo)}`;

  const showGoogle = providers?.google !== false;
  const showApple = providers?.apple !== false;
  const hasAnySocial = showGoogle || showApple;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {hasAnySocial && (
        <>
          <div className="grid gap-2">
            {showGoogle && (
              <a
                href={socialUrl('google')}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2 text-sm font-medium hover:bg-accent"
              >
                <GoogleMark className="h-4 w-4" />
                Continue with Google
              </a>
            )}
            {showApple && (
              <a
                href={socialUrl('apple')}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2 text-sm font-medium hover:bg-accent"
              >
                <AppleMark className="h-4 w-4" />
                Continue with Apple
              </a>
            )}
          </div>

          <div className="my-4 flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex-1 border-t border-border" />
            OR
            <div className="flex-1 border-t border-border" />
          </div>
        </>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
          <input
            type="password"
            required
            minLength={mode === 'signup' ? 10 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {mode === 'signup' && (
            <p className="mt-1 text-[11px] text-muted-foreground">At least 10 characters, with a letter and a number.</p>
          )}
        </div>
        {mode === 'signup' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Your name <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? mode === 'signup'
              ? 'Creating…'
              : 'Signing in…'
            : mode === 'signup'
            ? 'Create account'
            : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        {mode === 'login' && (
          <Link href="/forgot-password" className="hover:text-foreground">
            Forgot password?
          </Link>
        )}
        <span className={mode === 'login' ? '' : 'ml-auto'}>
          {mode === 'login' ? `New to ${brand}?` : 'Already have an account?'}{' '}
          <Link href={otherHref} className="font-medium text-foreground hover:underline">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </span>
      </div>
      <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground/80">
        Identity is powered by{' '}
        <a href="https://huudis.com" className="underline hover:text-foreground">
          Huudis
        </a>
        . One account for every Forjio product.
      </p>
    </div>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21.6 12.227c0-.708-.064-1.39-.182-2.045H12v3.868h5.384a4.603 4.603 0 0 1-1.997 3.018v2.51h3.232c1.891-1.742 2.98-4.307 2.98-7.35Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 4.965-.895 6.62-2.422l-3.233-2.51c-.895.6-2.041.955-3.386.955-2.604 0-4.81-1.76-5.596-4.122H3.067v2.59A9.996 9.996 0 0 0 12 22Z" fill="#34A853" />
      <path d="M6.404 13.9a6.016 6.016 0 0 1 0-3.8V7.512H3.067a9.996 9.996 0 0 0 0 8.977L6.404 13.9Z" fill="#FBBC05" />
      <path d="M12 5.977c1.468 0 2.786.505 3.823 1.497l2.868-2.868C16.96 2.986 14.696 2 12 2 8.118 2 4.76 4.232 3.067 7.51l3.337 2.59C7.19 7.737 9.396 5.977 12 5.977Z" fill="#EA4335" />
    </svg>
  );
}

function AppleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
      <path d="M17.564 12.73c-.037-3.16 2.58-4.678 2.698-4.752-1.47-2.146-3.76-2.44-4.576-2.473-1.948-.2-3.8 1.148-4.788 1.148-.993 0-2.513-1.12-4.13-1.091-2.127.03-4.085 1.236-5.174 3.142-2.207 3.82-.562 9.463 1.58 12.56 1.052 1.514 2.306 3.216 3.952 3.155 1.586-.065 2.185-1.026 4.102-1.026 1.917 0 2.455 1.026 4.133.99 1.705-.03 2.785-1.546 3.83-3.066 1.207-1.757 1.702-3.462 1.731-3.55-.038-.018-3.325-1.274-3.358-5.037Zm-3.154-9.24c.878-1.06 1.467-2.542 1.306-4.014-1.26.051-2.79.838-3.695 1.898-.813.937-1.524 2.433-1.333 3.885 1.405.108 2.843-.712 3.722-1.77Z" />
    </svg>
  );
}
