import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyFirebaseAuth, getFirebaseToken } from '@hono/firebase-auth';
import type { FirebaseIdToken } from 'firebase-auth-cloudflare-workers';

type Variables = {
  firebaseIdToken: FirebaseIdToken;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:8787'],
  credentials: true,
}));

// Apply Firebase Auth middleware to all /api/* routes except public ones
app.use('/api/*', async (c, next) => {
  // Skip auth for public endpoints
  const publicEndpoints = ['/api/public'];
  if (publicEndpoints.some(endpoint => c.req.path.startsWith(endpoint))) {
    return next();
  }

  // Apply Firebase Auth verification
  return verifyFirebaseAuth({
    projectId: 'planer-2025',
    authorizationHeaderKey: 'Authorization',
  })(c, next);
});

// Get current user info (authenticated endpoint)
app.get('/api/user', async (c) => {
  try {
    const idToken = getFirebaseToken(c);
    
    if (!idToken) {
      return c.json({ error: "User not authenticated" }, 401);
    }
    
    return c.json({
      success: true,
      user: {
        uid: idToken.uid,
        email: idToken.email,
        email_verified: idToken.email_verified || false,
      },
    });
  } catch (error) {
    return c.json(
      { error: "Failed to get user info", message: (error as Error).message },
      500
    );
  }
});

// Get current version of the application
app.get('/api/version', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      "SELECT version, platform, build_number, release_date, description FROM app_version WHERE is_current = 1 ORDER BY created_at DESC LIMIT 1"
    ).first();

    if (!result) {
      return c.json({ error: "Version not found" }, 404);
    }

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return c.json(
      { error: "Database error", message: (error as Error).message },
      500
    );
  }
});

// Get all versions
app.get('/api/versions', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM app_version ORDER BY created_at DESC"
    ).all();

    return c.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    return c.json(
      { error: "Database error", message: (error as Error).message },
      500
    );
  }
});

// Test API endpoint
app.get('/api/*', (c) => {
  return c.json({
    name: c.env.MY_NAME,
    message: "API is working!",
  });
});

export default app;
