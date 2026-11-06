import assert from "node:assert/strict";
import { test } from "node:test";

test("campaign creation writes only fields accepted by the live collection", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.APPWRITE_API_KEY;
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const originalClerk = require.cache[clerkPath];
  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  require.cache[clerkPath] = {
    exports: {
      auth: async () => ({ userId: "synthetic_owner" }),
      clerkClient: async () => ({ users: { getUser: async () => ({
        id: "synthetic_owner",
        firstName: "Test", lastName: "Citizen", username: "synthetic", imageUrl: "",
      }) } }),
    },
  } as NodeModule;

  const liveFields = new Set([
    "created_by", "title", "slug", "description", "goals", "category", "state",
    "status", "created_at", "language", "start_date", "end_date", "featured", "volunteer_count",
  ]);

  try {
    const { POST } = await import("./route");
    let writes = 0;
    globalThis.fetch = async (_input, init) => {
      assert.equal(init?.method, "POST");
      writes += 1;
      const body = JSON.parse(String(init.body)) as { data: Record<string, unknown> };
      const unsupported = Object.keys(body.data).filter((key) => !liveFields.has(key));
      if (unsupported.length) {
        return Response.json({ message: `Unknown fields: ${unsupported.join(", ")}` }, { status: 400 });
      }
      return Response.json({ $id: "synthetic_campaign", ...body.data }, { status: 201 });
    };

    const response = await POST(new Request("https://example.test/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Synthetic civic campaign",
        description: "This synthetic campaign checks the save path without citizen records or real locations.",
        goals: "Confirm a campaign can save using the live collection fields.",
        category: "infrastructure",
        state: "Test State",
        language: "en",
      }),
    }) as never);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.success, true);
    assert.ok(result.slug);
    assert.equal(writes, 1);
  } finally {
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
  }
});
