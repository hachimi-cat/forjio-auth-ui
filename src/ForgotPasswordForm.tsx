'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTurnstileTheme } from './useTurnstileTheme';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { defaultEndpoints, type AuthEndpoints } from './types';

// Enabled family-wide via NEXT_PUBLIC_TURNSTILE_SITE_KEY (see AuthForm).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export interface ForgotPasswordFormProps {
  endpoints?: Partial<AuthEndpoints>;
}

export function ForgotPasswordForm({ endpoints }: ForgotPasswordFormProps = {}) {
  const ep: AuthEndpoints = { ...defaultEndpoints, ...endpoints };
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileTheme = useTurnstileTheme();
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(ep.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...(TURNSTILE_SITE_KEY ? { 'cf-turnstile-response': turnstileToken } : {}),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(payload?.error?.message ?? `Request failed (${res.status})`);
      }
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
          <span>
            If <strong>{email}</strong> has a Huudis account, we&rsquo;ve sent a reset link. It expires in 1 hour.
          </span>
        </div>
        <Link href="/login" className="block text-center text-sm font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <div>
        <Label className="mb-1 block text-xs leading-4 text-muted-foreground">Email</Label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
          className="h-auto border-border bg-background py-2 text-sm shadow-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      {TURNSTILE_SITE_KEY && (
        <div className="flex justify-center py-1">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onError={() => setError('Security check failed.')}
            options={{ theme: turnstileTheme }}
          />
        </div>
      )}
      <Button
        type="submit"
        disabled={submitting}
        className="flex h-auto w-full py-2.5 shadow-none hover:opacity-90"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Sending…' : 'Send reset link'}
      </Button>
      <div className="text-center text-xs text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
