import assert from "node:assert/strict";
import { test } from "node:test";

test("comment saves only live collection fields and keeps private fields out", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.APPWRITE_API_KEY;
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const originalClerk = require.cache[clerkPath];
  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  require.cache[clerkPath] = {
    exports: {
      auth: async () => ({ userId: "synthetic_owner" }),
    },
  } as NodeModule;

  try {
    const { POST } = await import("./route");
    let saved: Record<string, unknown> = {};
    globalThis.fetch = async (_url, init) => init?.method === "POST"
      ? Response.json({
          $id: "synthetic_comment",
          issue_id: "synthetic_issue",
          user_id: "synthetic_owner",
          ...(saved = (JSON.parse(String(init.body)) as { data: Record<string, unknown> }).data),
          content: "Synthetic comment",
          status: "approved",
          $createdAt: "2026-10-16T00:00:00.000Z",
          private_note: "do not return",
        })
      : Response.json({ documents: [{ $id: "synthetic_issue", status: "open" }] });

    const response = await POST(new Request("https://example.test/api/issues/test/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Synthetic comment" }),
    }), { params: Promise.resolve({ slug: "test" }) });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(Object.keys(body.comment).sort(), ["$id", "avatar_url", "content", "createdAt", "issue_id", "status", "user_name"]);
    assert.equal(body.comment.$id, "synthetic_comment");
    assert.equal(body.comment.createdAt, "2026-10-16T00:00:00.000Z");
    assert.equal(body.comment.avatar_url, "");
    assert.equal(body.comment.user_name, "Citizen");
    assert.deepEqual(Object.keys(saved).sort(), ["content", "issue_id", "language", "status", "user_id"]);
    assert.equal(saved.user_id, "synthetic_owner");
  } finally {
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
  }
});

test("an uncertain comment save returns safe retry guidance", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.APPWRITE_API_KEY;
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const originalClerk = require.cache[clerkPath];
  const originalError = console.error;
  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  require.cache[clerkPath] = {
    exports: {
      auth: async () => ({ userId: "synthetic_owner" }),
      currentUser: async () => null,
    },
  } as NodeModule;

  try {
    const { POST } = await import("./route");
    const logged: unknown[][] = [];
    console.error = (...args: unknown[]) => { logged.push(args); };
    globalThis.fetch = async (_url, init) => init?.method === "POST"
      ? Response.json({ message: "private synthetic detail" }, { status: 500 })
      : Response.json({ documents: [{ $id: "synthetic_issue", status: "open" }] });

    const response = await POST(new Request("https://example.test/api/issues/test/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Synthetic comment" }),
    }), { params: Promise.resolve({ slug: "test" }) });

    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error: "We couldn't confirm your comment was saved. Check the discussion before trying again.",
    });
    assert.equal(JSON.stringify(logged).includes("private synthetic detail"), false);
  } finally {
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    globalThis.fetch = originalFetch;
    console.error = originalError;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
  }
});
