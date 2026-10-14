import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";

test("bulk alert read separates account failure from uncertain update", async () => {
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const originalClerk = require.cache[clerkPath];
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const originalKey = process.env.APPWRITE_API_KEY;
  let authMode: "failure" | "unsigned" | "signed" = "failure";
  let fetchCalls = 0;

  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  require.cache[clerkPath] = {
    exports: {
      auth: async () => {
        if (authMode === "failure") throw new Error("synthetic Clerk failure");
        return { userId: authMode === "signed" ? "synthetic_owner" : null };
      },
    },
  } as NodeModule;

  try {
    const { PATCH } = await import("./route");
    console.error = () => {};
    globalThis.fetch = async () => {
      fetchCalls += 1;
      return Response.json({ message: "synthetic storage failure" }, { status: 500 });
    };
    const request = () => new NextRequest("https://example.test/api/notifications", { method: "PATCH" });

    const accountFailure = await PATCH(request());
    assert.equal(accountFailure.status, 503);
    assert.deepEqual(await accountFailure.json(), { error: "Unable to load your account. Please try again." });
    assert.equal(fetchCalls, 0);

    authMode = "unsigned";
    const unsigned = await PATCH(request());
    assert.equal(unsigned.status, 401);
    assert.equal(fetchCalls, 0);

    authMode = "signed";
    const uncertain = await PATCH(request());
    assert.equal(uncertain.status, 503);
    assert.deepEqual(await uncertain.json(), {
      error: "Some alerts may have been marked as read. Refresh alerts before trying again.",
    });
    assert.equal(fetchCalls, 1);
  } finally {
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    globalThis.fetch = originalFetch;
    console.error = originalError;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
  }
});

test("alert pages stay owner-scoped and stop at the supported offset", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.APPWRITE_API_KEY;
  process.env.APPWRITE_API_KEY = "synthetic-test-key";
  let signedInUser: string | null = "synthetic_owner";
  let totalAlerts = 52;
  const clerkPath = require.resolve("@clerk/nextjs/server");
  const originalClerk = require.cache[clerkPath];
  require.cache[clerkPath] = {
    exports: { auth: async () => ({ userId: signedInUser }) },
  } as NodeModule;

  try {
    const { GET } = await import("./route");
    const seenOffsets: number[] = [];
    globalThis.fetch = async (input) => {
      const queries = new URL(String(input)).searchParams.getAll("queries[]").map((query) => JSON.parse(query));
      assert.ok(queries.some((query) => query.attribute === "user_id" && query.values[0] === "synthetic_owner"));
      const offset = queries.find((query) => query.method === "offset")?.values[0] ?? 0;
      const limit = queries.find((query) => query.method === "limit")?.values[0];
      seenOffsets.push(offset);
      const count = Math.max(0, Math.min(limit, totalAlerts - offset));
      return Response.json({ documents: Array.from({ length: count }, (_, index) => ({
        $id: `synthetic_${offset + index}`,
        user_id: "synthetic_owner",
        type: "system",
        title: "Synthetic alert",
        message: "Synthetic fixture only",
        read: false,
        created_at: "2026-10-14T00:00:00.000Z",
      })) });
    };

    const first = await GET(new NextRequest("https://example.test/api/notifications"));
    const firstBody = await first.json();
    assert.equal(first.status, 200);
    assert.equal(firstBody.notifications.length, 50);
    assert.equal(firstBody.hasMore, true);

    const second = await GET(new NextRequest("https://example.test/api/notifications?offset=50"));
    const secondBody = await second.json();
    assert.equal(second.status, 200);
    assert.equal(secondBody.notifications.length, 2);
    assert.equal(secondBody.hasMore, false);
    assert.deepEqual(seenOffsets, [0, 50]);

    totalAlerts = 101;
    const fullPage = await GET(new NextRequest("https://example.test/api/notifications?limit=100"));
    const fullPageBody = await fullPage.json();
    assert.equal(fullPageBody.notifications.length, 100);
    assert.equal(fullPageBody.hasMore, true);
    assert.deepEqual(seenOffsets, [0, 50, 0, 100]);

    const cappedPage = await GET(new NextRequest("https://example.test/api/notifications?offset=10000"));
    assert.equal((await cappedPage.json()).hasMore, false);
    assert.deepEqual(seenOffsets, [0, 50, 0, 100, 10000]);

    for (const offset of ["-1", "10001", "1e3", "01"]) {
      const response = await GET(new NextRequest(`https://example.test/api/notifications?offset=${offset}`));
      assert.equal(response.status, 400);
    }
    for (const limit of ["0", "-1", "1e3"]) {
      const response = await GET(new NextRequest(`https://example.test/api/notifications?limit=${limit}`));
      assert.equal(response.status, 400);
    }
    assert.deepEqual(seenOffsets, [0, 50, 0, 100, 10000]);

    signedInUser = null;
    const unsigned = await GET(new NextRequest("https://example.test/api/notifications"));
    assert.equal(unsigned.status, 401);
    assert.deepEqual(seenOffsets, [0, 50, 0, 100, 10000]);
  } finally {
    if (originalClerk) require.cache[clerkPath] = originalClerk;
    else delete require.cache[clerkPath];
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.APPWRITE_API_KEY;
    else process.env.APPWRITE_API_KEY = originalKey;
  }
});
