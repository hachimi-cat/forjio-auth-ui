'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { defaultEndpoints, type AuthEndpoints } from './types';

export interface ResetPasswordFormProps {
  endpoints?: Partial<AuthEndpoints>;
}

export function ResetPasswordForm({ endpoints }: ResetPasswordFormProps = {}) {
  const ep: AuthEndpoints = { ...defaultEndpoints, ...endpoints };
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(ep.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(payload?.error?.message ?? `Request failed (${res.status})`);
      }
      setDone(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Missing or invalid reset link. <Link href="/forgot-password" className="font-medium underline">Request a new one</Link>.
          </span>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
        <span>Password updated. Taking you to sign in…</span>
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
        <label className="mb-1 block text-xs font-medium text-muted-foreground">New password</label>
        <input
          type="password"
          required
          minLength={10}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          autoFocus
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p className="mt-1 text-[11px] text-muted-foreground">At least 10 characters, with a letter and a number.</p>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
