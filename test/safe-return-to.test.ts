// Run with `npm test` (node --test; Node >= 22.18 strips the types itself).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeReturnTo } from '../src/lib/safe-return-to.ts';

const ORIGIN = 'https://plugipay.com';
const FALLBACK = '/dashboard';

test('same-site paths are followed', () => {
  for (const p of ['/dashboard', '/dashboard/billing?tab=invoices#due', '/creators/onboarding', '/api/v1/auth/oidc/start?role=admin']) {
    assert.equal(safeReturnTo(p, FALLBACK, ORIGIN), p);
  }
});

test('an absolute URL on the same origin is followed', () => {
  assert.equal(safeReturnTo('https://plugipay.com/dashboard', FALLBACK, ORIGIN), 'https://plugipay.com/dashboard');
});

test('other sites are refused, however they are spelled', () => {
  for (const evil of [
    '/\\evil.com', // browsers read it as //evil.com — the 0.10.0 regex let it through
    '/\\/evil.com',
    '\\\\evil.com',
    '//evil.com',
    '/\t/evil.com', // tab is stripped → //evil.com
    '/\n/evil.com',
    '/\r/evil.com',
    '/\u0000/evil.com',
    'https://evil.com',
    'https://plugipay.com.evil.com/',
    'http://plugipay.com/dashboard', // other scheme = other origin
    'javascript:alert(1)',
    ' //evil.com',
  ]) {
    assert.equal(safeReturnTo(evil, FALLBACK, ORIGIN), FALLBACK, JSON.stringify(evil));
  }
});

test('empty or missing falls back', () => {
  assert.equal(safeReturnTo(null, FALLBACK, ORIGIN), FALLBACK);
  assert.equal(safeReturnTo(undefined, FALLBACK, ORIGIN), FALLBACK);
  assert.equal(safeReturnTo('', FALLBACK, ORIGIN), FALLBACK);
});

test('without an origin (server render) only a same-site path passes', () => {
  assert.equal(safeReturnTo('/dashboard', FALLBACK, undefined), '/dashboard');
  assert.equal(safeReturnTo('//evil.com', FALLBACK, undefined), FALLBACK);
  assert.equal(safeReturnTo('/\\evil.com', FALLBACK, undefined), FALLBACK);
  assert.equal(safeReturnTo('https://plugipay.com/x', FALLBACK, undefined), FALLBACK);
});
