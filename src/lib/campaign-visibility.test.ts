import assert from "node:assert/strict";
import test from "node:test";

import { isPublicCampaignStatus } from "./campaign-visibility";

test("only reviewed campaign states are public", () => {
  for (const status of ["active", "completed", "paused"]) {
    assert.equal(isPublicCampaignStatus(status), true);
  }
  for (const status of ["pending_review", "rejected", "escalated", "", null, undefined]) {
    assert.equal(isPublicCampaignStatus(status), false);
  }
});
