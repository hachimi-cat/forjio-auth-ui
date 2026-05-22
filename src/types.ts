/** Endpoint paths the auth forms hit on the host product's backend.
 *  Defaults match the Forjio family convention (`@forjio/sdk/auth-
 *  handlers`); override only for unusual layouts. */
export interface AuthEndpoints {
  login: string;
  signup: string;
  forgotPassword: string;
  resetPassword: string;
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
