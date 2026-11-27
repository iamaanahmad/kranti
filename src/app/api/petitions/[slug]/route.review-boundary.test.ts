import assert from "node:assert/strict";
import { test } from "node:test";

test("pending petition details are limited to the owner and reviewers", async () => {
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
  require.cache[clerkPath] = { exports: { auth: async () => ({ userId }), currentUser: async () => ({ id: userId }) } } as NodeModule;
  require.cache[rolePath] = { exports: { getUserRole: async () => role } } as NodeModule;
  try {
    globalThis.fetch = async (input) => {
      const url = new URL(String(input));
      const collection = url.pathname.split("/collections/")[1]?.split("/")[0] ?? "";
      if (collection === "petitions") return Response.json({ documents: [{
        $id: "synthetic-petition", slug: "synthetic-slug", title: "Private synthetic title",
        created_by: "synthetic-owner", status, signature_count: 0, signature_goal: 100,
      }] });
      return Response.json({ documents: [] });
    };
    const { GET } = await import("./route");
    const request = () => GET(new Request("https://example.test/api/petitions/synthetic-slug"), {
      params: Promise.resolve({ slug: "synthetic-slug" }),
    });
    const guest = await request();
    assert.equal(guest.status, 404);
    assert.doesNotMatch(await guest.text(), /Private synthetic title/);
    userId = "synthetic-stranger";
    role = "citizen";
    assert.equal((await request()).status, 404);
    userId = "synthetic-owner";
    const owner = await request();
    assert.equal(owner.status, 200);
    assert.equal((await owner.json()).petition.title, "Private synthetic title");
    userId = "synthetic-reviewer";
    role = "moderator";
    assert.equal((await request()).status, 200);
    status = "open";
    userId = null;
    assert.equal((await request()).status, 200);
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
