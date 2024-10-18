import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.140.0/http/file_server.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  
  // Serve static files
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "static",
    });
  }

  // Serve index.html for all other routes
  if (!pathname.startsWith("/static")) {
    return new Response(await Deno.readTextFile("./public/index.html"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response("Not Found", { status: 404 });
});

console.log("Server running on http://localhost:8000");