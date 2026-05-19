# @forjio/auth-ui

Shared auth forms for the Forjio family. Login, signup, forgot-
password, reset-password — all with the same look as every other
Forjio product, all wired to the standard `@forjio/sdk/auth-handlers`
backend endpoints (override via `endpoints` prop if your product mounts
them somewhere else).

Sister package to [`@forjio/website-ui`](https://github.com/hachimi-cat/forjio-website-ui)
+ [`@forjio/portal-ui`](https://github.com/hachimi-cat/forjio-portal-ui).
Extracted from `saas-plugipay` on 2026-05-19 as the canonical reference
build per TEMPLATE.md Step 4.

## Install

```bash
npm i @forjio/auth-ui lucide-react
```

Peer deps: `react`, `react-dom`, `next` (App Router), `lucide-react`.
Tailwind is **not** a peer dep but the components use shadcn-style
utility classes (`bg-primary`, `text-muted-foreground`, etc.) so the
host product needs a Tailwind config that exposes the shadcn token set.

## Usage

```tsx
// app/(auth)/login/page.tsx
'use client';
import { AuthForm } from '@forjio/auth-ui';

export default function LoginPage() {
  return <AuthForm mode="login" brand="Kalium" />;
}

// app/(auth)/signup/page.tsx
'use client';
import { AuthForm } from '@forjio/auth-ui';

export default function SignupPage() {
  return <AuthForm mode="signup" brand="Kalium" />;
}

// app/(auth)/forgot-password/page.tsx
'use client';
import { ForgotPasswordForm } from '@forjio/auth-ui';

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

// app/(auth)/reset-password/page.tsx
'use client';
import { ResetPasswordForm } from '@forjio/auth-ui';

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
```

## Props

### `AuthForm`

| Prop              | Default                          | Notes                                                |
|-------------------|----------------------------------|------------------------------------------------------|
| `mode`            | required                         | `'login'` or `'signup'`                              |
| `brand`           | required                         | Brand name shown in copy (e.g. `'Kalium'`)           |
| `endpoints`       | family defaults                  | Override paths if backend mounts differ              |
| `providers`       | `null` (fail-open shows both)    | `{ google: bool, apple: bool }` — host fetches       |
| `defaultReturnTo` | `/dashboard`                     | Redirect after success; `?return_to=` overrides      |

### `ForgotPasswordForm` / `ResetPasswordForm`

| Prop        | Default          | Notes                              |
|-------------|------------------|------------------------------------|
| `endpoints` | family defaults  | Override paths if backend differs  |

## Endpoint defaults

```ts
{
  login:          '/api/v1/auth/login',
  signup:         '/api/v1/auth/signup',
  forgotPassword: '/api/v1/auth/password-reset/request',
  resetPassword:  '/api/v1/auth/password-reset/complete',
  socialStart:    '/api/v1/auth/huudis/start',
}
```

These match the routes mounted by `@forjio/sdk/auth-handlers`. New
products should mount the same paths and not override the prop.

## Why Tailwind classes (not inline styles)?

Auth forms are visually opinionated — inputs, buttons, error states,
labels — and every Forjio product uses shadcn-flavored Tailwind. Inline
styles would diverge from the host's design system. The shadcn token
set (`bg-primary`, `text-muted-foreground`, `border-border`) is stable
across all 8 active products. Sister `@forjio/portal-ui` uses inline
styles because its surface is structural chrome where Tailwind would
collide with the host.

## License

UNLICENSED — private Forjio family package.
