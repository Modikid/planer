export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API для получения информации о текущей версии приложения
    if (url.pathname === "/api/version") {
      try {
        const result = await env.DB.prepare(
          "SELECT version, platform, build_number, release_date, description FROM app_version WHERE is_current = 1 ORDER BY created_at DESC LIMIT 1"
        ).first();

        if (!result) {
          return Response.json({ error: "Version not found" }, { status: 404 });
        }

        return Response.json({
          success: true,
          data: result,
        });
      } catch (error) {
        return Response.json(
          { error: "Database error", message: (error as Error).message },
          { status: 500 }
        );
      }
    }

    // API для получения всех версий
    if (url.pathname === "/api/versions") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM app_version ORDER BY created_at DESC"
        ).all();

        return Response.json({
          success: true,
          data: results,
          count: results.length,
        });
      } catch (error) {
        return Response.json(
          { error: "Database error", message: (error as Error).message },
          { status: 500 }
        );
      }
    }

    // Тестовый API endpoint
    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: `${env.MY_NAME}`,
        message: "API is working!",
      });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
