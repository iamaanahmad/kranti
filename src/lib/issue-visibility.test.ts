import assert from "node:assert/strict";
import { test } from "node:test";

import { isPublicIssue } from "./issue-visibility";

test("only approved public issue states can appear on public routes", () => {
  assert.equal(isPublicIssue({ status: "open", visibility: "private" }), false);
  assert.equal(isPublicIssue({ status: "pending_review", visibility: "public" }), false);
  assert.equal(isPublicIssue({ status: "rejected", visibility: "public" }), false);
  assert.equal(isPublicIssue({ status: "open" }), false);
  assert.equal(isPublicIssue({ status: "open", visibility: "public" }), true);
  assert.equal(isPublicIssue({ status: "resolved", visibility: "public" }), true);
});
