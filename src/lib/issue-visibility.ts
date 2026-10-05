export const PUBLIC_ISSUE_STATUSES = new Set(["open", "in_progress", "escalated", "resolved"]);

export function isPublicIssue(issue: Record<string, unknown>): boolean {
  return issue.visibility === "public" && PUBLIC_ISSUE_STATUSES.has(String(issue.status ?? ""));
}
