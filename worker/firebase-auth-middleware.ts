// Local implementation based on @hono/firebase-auth
// Source: https://github.com/honojs/middleware/tree/main/packages/firebase-auth

import type { Context, MiddlewareHandler } from 'hono';
import { Auth, WorkersKVStoreSingle, type FirebaseIdToken } from 'firebase-auth-cloudflare-workers';

export type VerifyFirebaseAuthConfig = {
  projectId: string;
  authorizationHeaderKey?: string;
};

export type VerifyFirebaseAuthEnv = {
  PUBLIC_JWK_CACHE_KEY: string;
  PUBLIC_JWK_CACHE_KV: KVNamespace;
};

export const verifyFirebaseAuth = (config: VerifyFirebaseAuthConfig): MiddlewareHandler => {
  const authorizationHeaderKey = config.authorizationHeaderKey || 'Authorization';

  return async (c: Context, next) => {
    const authorization = c.req.header(authorizationHeaderKey);
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
      const token = authorization.replace('Bearer ', '');
      const env = c.env as VerifyFirebaseAuthEnv;
      
      const auth = Auth.getOrInitialize(
        config.projectId,
        WorkersKVStoreSingle.getOrInitialize(env.PUBLIC_JWK_CACHE_KEY, env.PUBLIC_JWK_CACHE_KV)
      );

      const idToken = await auth.verifyIdToken(token);
      c.set('idToken', idToken);
      
      return next();
    } catch (error) {
      console.error('Firebase auth verification failed:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }
  };
};

export const getFirebaseToken = (c: Context): FirebaseIdToken | null => {
  return c.get('idToken') || null;
};


