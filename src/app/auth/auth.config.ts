// src/app/auth/auth.config.ts
import { ENV } from './../core/env.config';

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
  NAMESPACE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '8Za7Y2U6cp7b63PbPxpaSVCXQmWnTAz8',
  CLIENT_DOMAIN: 'katyev.eu.auth0.com', // e.g., you.auth0.com
  // AUDIENCE: 'http://localhost:8083/api/', // e.g., http://localhost:8083/api/
//  AUDIENCE: 'https://katyev.eu.auth0.com/userinfo', // e.g., http://localhost:8083/api/
//  AUDIENCE: 'https://katyev.eu.auth0.com/api/v2/', // e.g., http://localhost:8083/api/
  AUDIENCE: 'http://localhost:8083/api', // e.g., http://localhost:8083/api/
  REDIRECT: `${ENV.BASE_URI}/callback`,
  SCOPE: 'openid profile user_metadata',
  NAMESPACE: 'https://www.sidhe.net/roles'
};
