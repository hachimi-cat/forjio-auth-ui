/** Endpoint paths the auth forms hit on the host product's backend.
 *  Defaults match the Forjio family convention (`@forjio/sdk/auth-
 *  handlers`); override only for unusual layouts. */
export interface AuthEndpoints {
  login: string;
  signup: string;
  forgotPassword: string;
  resetPassword: string;
  /** Product-hosted MFA verify path. The login POST returns
   *  `{ mfaRequired, mfaChallengeToken, methods, expiresAt }` when the
   *  user has MFA enabled and the product opted into in-product OTP;
   *  the form then POSTs `{ mfaChallengeToken, code }` here. Shares the
   *  same base-path convention as `login`. */
  mfa: string;
  /** Social-provider start path. `?provider=<google|apple|facebook>` is
   *  appended by the form. Hitting it with no `provider=` lands on the
   *  Huudis hosted login (used for the MFA hand-off). */
  socialStart: string;
  /** The session check (`GET`). 200 with a user = already signed in, so the
   *  login and signup forms send the visitor straight to `return_to` instead
   *  of asking again. The role (from `extraBody.role`) is appended as
   *  `?role=`, which `@forjio/sdk/auth-server`'s /me reads. */
  me: string;
}

export const defaultEndpoints: AuthEndpoints = {
  login: '/api/v1/auth/login',
  signup: '/api/v1/auth/signup',
  forgotPassword: '/api/v1/auth/password-reset/request',
  resetPassword: '/api/v1/auth/password-reset/complete',
  mfa: '/api/v1/auth/mfa',
  socialStart: '/api/v1/auth/huudis/start',
  me: '/api/v1/auth/me',
};

/**
 * Every string these forms put on screen.
 *
 * WHY THIS EXISTS. The auth forms are the one part of a product's UI the
 * product does not own — a host can translate all of its own `src/` and still
 * ship a login page in English, because the words live in here. Products pass
 * a partial override; anything they omit keeps the English below, so adding
 * this prop cannot change a single pixel for a product that ignores it.
 *
 * A SENTENCE IS ONE KEY. `newToBrand` carries `{brand}` rather than being
 * concatenated around the product name, so a translation can put the brand
 * wherever that language's grammar wants it.
 */
export interface AuthCopy {
  // Fields
  email: string;
  password: string;
  name: string;
  /** Shown beside an optional field's label. */
  optional: string;
  newPassword: string;
  passwordHint: string;
  /** Divider between the social buttons and the credential form. */
  orDivider: string;
  // Primary actions
  signIn: string;
  signUp: string;
  createAccount: string;
  signingIn: string;
  creating: string;
  redirecting: string;
  // Mode switch + links
  forgotPassword: string;
  /** `{brand}` is substituted with the `brand` prop. */
  newToBrand: string;
  alreadyHaveAccount: string;
  identityPoweredBy: string;
  /** Sentence after the Huudis link. */
  oneAccountNote: string;
  // Social
  continueWithGoogle: string;
  continueWithApple: string;
  continueWithFacebook: string;
  // Two-factor step
  twoFactorTitle: string;
  twoFactorHint: string;
  verificationCode: string;
  verificationCodeAria: string;
  /** `{time}` is the remaining mm:ss. */
  codeExpiresIn: string;
  codeExpired: string;
  verify: string;
  verifying: string;
  backToSignIn: string;
  redirectingTwoFactor: string;
  // Forgot password
  sendResetLink: string;
  sending: string;
  securityCheckFailed: string;
  /** `{detail}` is the SSO error detail. */
  signInFailed: string;
  // Reset password
  missingResetLink: string;
  requestNewOne: string;
  passwordUpdated: string;
  updatePassword: string;
  updating: string;
}

/** The English these forms have always shipped. Overriding nothing leaves a
 *  product byte-identical to before `copy` existed. */
export const defaultAuthCopy: AuthCopy = {
  email: 'Email',
  password: 'Password',
  name: 'Your name',
  optional: '(optional)',
  newPassword: 'New password',
  passwordHint: 'At least 10 characters, with a letter and a number.',
  orDivider: 'OR',
  signIn: 'Sign in',
  signUp: 'Sign up',
  createAccount: 'Create account',
  signingIn: 'Signing in…',
  creating: 'Creating…',
  redirecting: 'Redirecting…',
  forgotPassword: 'Forgot password?',
  newToBrand: 'New to {brand}?',
  alreadyHaveAccount: 'Already have an account?',
  identityPoweredBy: 'Identity is powered by',
  oneAccountNote: 'One account for every Forjio product.',
  continueWithGoogle: 'Continue with Google',
  continueWithApple: 'Continue with Apple',
  continueWithFacebook: 'Continue with Facebook',
  twoFactorTitle: 'Two-factor authentication',
  twoFactorHint: 'Enter the 6-digit code from your authenticator app.',
  verificationCode: 'Verification code',
  verificationCodeAria: 'Six-digit verification code',
  codeExpiresIn: 'Code expires in {time}',
  codeExpired: 'Code expired — go back and sign in again.',
  verify: 'Verify',
  verifying: 'Verifying…',
  backToSignIn: 'Back to sign in',
  redirectingTwoFactor: 'Redirecting you to complete two-factor sign-in…',
  sendResetLink: 'Send reset link',
  sending: 'Sending…',
  securityCheckFailed: 'Security check failed.',
  signInFailed: 'Sign-in failed: {detail}',
  missingResetLink: 'Missing or invalid reset link.',
  requestNewOne: 'Request a new one',
  passwordUpdated: 'Password updated. Taking you to sign in…',
  updatePassword: 'Update password',
  updating: 'Updating…',
};

/** Merge a caller's partial override onto the English defaults. */
export function resolveAuthCopy(copy?: Partial<AuthCopy>): AuthCopy {
  return copy ? { ...defaultAuthCopy, ...copy } : defaultAuthCopy;
}

/** Substitute `{name}` placeholders — the same shape the Forjio products use
 *  in their own catalogs, so a translated string behaves identically here. */
export function fillCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : whole,
  );
}

/** Which social-login buttons to render. Default = both, since fail-
 *  open matches the host product's expectation (Huudis tells the
 *  consumer which providers are off via a separate fetch the host
 *  does — pass the result here). */
export interface SocialProviders {
  google?: boolean;
  apple?: boolean;
  facebook?: boolean;
}
