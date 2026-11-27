import assert from "node:assert/strict";
import { test } from "node:test";

test("petition reviews require a reviewer and only act on pending petitions", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.APPWRITE_API_KEY;
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const rolePath = require.resolve("@/lib/role-lookup");
  const originalClerk = require.cache[clerkPath];
  const originalRole = require.cache[rolePath];
  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  let userId: string | null = null;
  let role = "citizen";
  let status = "pending_review";
  const writes: string[] = [];
  require.cache[clerkPath] = { exports: { auth: async () => ({ userId }), currentUser: async () => ({ id: userId }) } } as NodeModule;
  require.cache[rolePath] = { exports: { getUserRole: async () => role } } as NodeModule;
  try {
    globalThis.fetch = async (input, init) => {
      const url = new URL(String(input));
      const collection = url.pathname.split("/collections/")[1]?.split("/")[0] ?? "";
      if (init?.method === "PATCH") {
        writes.push(`${collection}:update`);
        status = JSON.parse(String(init.body)).data.status;
        return Response.json({ $id: "synthetic-petition" });
      }
      if (init?.method === "POST") {
        writes.push(`${collection}:create`);
        return Response.json({ $id: "synthetic-log" });
      }
      if (collection === "petitions" && url.pathname.endsWith("synthetic-petition")) {
        return Response.json({ $id: "synthetic-petition", status, created_by: "synthetic-owner", slug: "synthetic-slug" });
      }
      return Response.json({ documents: collection === "petitions" ? [{ $id: "synthetic-petition", status, title: "Synthetic title" }] : [] });
    };
    const { GET, POST } = await import("./route");
    const request = (action = "approve") => new Request("https://example.test/api/admin/petitions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petitionId: "synthetic-petition", action, reason: "Reviewed synthetic case." }),
    });
    assert.equal((await GET(new Request("https://example.test/api/admin/petitions"))).status, 401);
    assert.equal((await POST(request())).status, 401);
    userId = "synthetic-citizen";
    assert.equal((await GET(new Request("https://example.test/api/admin/petitions"))).status, 403);
    assert.equal((await POST(request())).status, 403);
    assert.deepEqual(writes, []);
    userId = "synthetic-reviewer";
    role = "moderator";
    const queue = await GET(new Request("https://example.test/api/admin/petitions"));
    assert.equal(queue.status, 200);
    assert.equal((await queue.json()).petitions[0].title, "Synthetic title");
    const approved = await POST(request());
    assert.equal(approved.status, 200);
    assert.equal((await approved.json()).newStatus, "open");
    assert.deepEqual(writes.slice(0, 2), ["petitions:update", "moderation_logs:create"]);
    assert.equal((await POST(request())).status, 409);
    assert.equal(writes.filter((write) => write === "moderation_logs:create").length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    if (originalRole) require.cache[rolePath] = originalRole;
    else delete require.cache[rolePath];
  }
});
