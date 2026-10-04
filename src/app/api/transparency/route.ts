import { NextResponse } from "next/server";

import {
  appwriteDatabaseId,
  appwriteIssuesCollectionId,
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
    const [allIssues, resolvedIssues] = await Promise.all([
      listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, ["limit(1)"]),
      listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, [
        'equal("status", ["resolved"])',
        "limit(1)",
      ]),
    ]);

    return NextResponse.json({
      available: true,
      totalIssues: Number(allIssues.total ?? 0),
      resolvedIssues: Number(resolvedIssues.total ?? 0),
    });
  } catch {
    return NextResponse.json({ available: false });
  }
}
