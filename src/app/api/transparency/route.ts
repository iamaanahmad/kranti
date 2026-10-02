import { NextResponse } from "next/server";

import {
  appwriteDatabaseId,
  appwriteIssuesCollectionId,
  appwriteModerationLogsCollectionId,
  getDocument,
  listDocuments,
} from "@/lib/appwrite";

export const runtime = "nodejs";

/**
 * GET /api/transparency
 *
 * Returns real aggregate counts from Appwrite for the public Transparency
 * dashboard. Figures that cannot be derived from platform data (moderation
 * turnaround, accuracy, funding breakdowns) are intentionally omitted — the
 * page renders "Public beta" / unavailable states for those instead of
 * invented numbers.
 */
export async function GET() {
  try {
    const [allIssues, resolvedIssues, logs] = await Promise.all([
      listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, ["limit(1)"]),
      listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, [
        'equal("status", ["resolved"])',
        "limit(1)",
      ]),
      listDocuments(appwriteDatabaseId, appwriteModerationLogsCollectionId, [
        'orderDesc("$createdAt")',
        "limit(5)",
      ]),
    ]);

    const recentActions = await Promise.all(
      (logs.documents ?? []).map(async (log: Record<string, unknown>) => {
        const contentId = String(log.content_id ?? "");
        let target = contentId ? `Issue ${contentId.slice(0, 8)}` : "Platform content";
        try {
          if (contentId) {
            const issue = (await getDocument(
              appwriteDatabaseId,
              appwriteIssuesCollectionId,
              contentId
            )) as Record<string, unknown>;
            if (issue?.title) target = String(issue.title);
          }
        } catch {
          // Keep the fallback label; a missing issue must not fail the whole response.
        }
        return {
          id: String(log.$id ?? contentId),
          action: String(log.action ?? "unknown").toUpperCase(),
          target,
          reason: String(log.reason ?? ""),
          timestamp: String(log.$createdAt ?? ""),
        };
      })
    );

    return NextResponse.json({
      available: true,
      totalIssues: Number(allIssues.total ?? 0),
      resolvedIssues: Number(resolvedIssues.total ?? 0),
      recentActions,
    });
  } catch {
    return NextResponse.json({ available: false });
  }
}
