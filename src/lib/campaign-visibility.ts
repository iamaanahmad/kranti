const publicCampaignStatuses = new Set(["active", "completed", "paused"]);

export function isPublicCampaignStatus(status: unknown): boolean {
  return typeof status === "string" && publicCampaignStatuses.has(status);
}
