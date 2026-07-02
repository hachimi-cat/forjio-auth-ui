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
}

export const defaultEndpoints: AuthEndpoints = {
  login: '/api/v1/auth/login',
  signup: '/api/v1/auth/signup',
  forgotPassword: '/api/v1/auth/password-reset/request',
  resetPassword: '/api/v1/auth/password-reset/complete',
  mfa: '/api/v1/auth/mfa',
  socialStart: '/api/v1/auth/huudis/start',
};

/** Which social-login buttons to render. Default = both, since fail-
 *  open matches the host product's expectation (Huudis tells the
 *  consumer which providers are off via a separate fetch the host
 *  does — pass the result here). */
export interface SocialProviders {
  google?: boolean;
  apple?: boolean;
  facebook?: boolean;
}
