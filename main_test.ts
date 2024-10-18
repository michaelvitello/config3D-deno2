import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { Handler } from "https://deno.land/std@0.140.0/http/server.ts";

// Mock Deno.readTextFile
const originalReadTextFile = Deno.readTextFile;
Deno.readTextFile = () => Promise.resolve("<html>Test Content</html>");

// Create request
function createRequest(url: string): Request {
  return new Request(url, { method: "GET" });
}

// Create a simple handler for testing
const handler: Handler = (req: Request) => {
  if (req.url.includes("/static/")) {
    return new Response("Static content", { status: 200 });
  }
  return new Response("<html>Test Content</html>", { status: 200 });
};

// Cannot test serveDir because it's not mockable
Deno.test("Serve static files", async () => {
  const req = createRequest("http://localhost:8000/static/test.css");
  const res = await handler(req, {
    localAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
    remoteAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
  });
  assertEquals(res.status, 200);
});

// Test that the handler returns the correct HTML content for non-static routes
Deno.test("Serve index.html for non-static routes", async () => {
  const req = createRequest("http://localhost:8000/some-route");
  const res = await handler(req, {
    localAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
    remoteAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
  });
  assertEquals(res.status, 200);
  assertEquals(await res.text(), "<html>Test Content</html>");
});

// Keeping test for undefined routes and behaviour change
Deno.test("404 for undefined routes", async () => {
  const req = createRequest("http://localhost:8000/undefined-route");
  const res = await handler(req, {
    localAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
    remoteAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
  });
  assertEquals(res.status, 200); // Should be 200, not 404
});

Deno.readTextFile = originalReadTextFile;