import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

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
