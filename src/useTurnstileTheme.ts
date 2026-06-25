import { useEffect, useState } from 'react';

// Match the Turnstile widget to the PRODUCT's actual theme by reading the
// rendered page-background luminance on mount, instead of Turnstile's
// `'auto'` (which follows the visitor's OS, not the product — so a
// fixed-light product like huudis showed a dark widget for dark-OS users).
// Reading the real background works for forced-light, forced-dark, AND
// OS-adaptive products alike, with zero per-product configuration.
export function useTurnstileTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    try {
      const bg = getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/\d+/g);
      if (m && m.length >= 3) {
        const lum = 0.299 * Number(m[0]) + 0.587 * Number(m[1]) + 0.114 * Number(m[2]);
        setTheme(lum < 128 ? 'dark' : 'light');
      }
    } catch {
      /* no DOM (SSR) — keep the light default until mount */
    }
  }, []);
  return theme;
}
