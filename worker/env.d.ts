import { VerifyFirebaseAuthEnv } from '@hono/firebase-auth';

// Extend the Env interface to include Firebase Auth bindings
declare global {
  interface Env extends VerifyFirebaseAuthEnv {
    DB: D1Database;
    MY_NAME: string;
    PUBLIC_JWK_CACHE_KEY: string;
    PUBLIC_JWK_CACHE_KV: KVNamespace;
  }
}

export {};
