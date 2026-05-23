import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  appwriteDatabaseId,
  appwriteIssuesCollectionId,
  appwriteSupportsCollectionId,
  createDocument,
  listDocuments,
  updateDocument,
} from "@/lib/appwrite";

export const runtime = "nodejs";

function supportDocumentId(issueId: string, userId: string) {
  return `support-${issueId}-${userId}`.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 36);
}

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const { slug } = await params;

  const issueQuery = await listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, [`equal("slug", ["${slug}"])`, "limit(1)"]);
  const issue = (issueQuery as { documents?: Array<{ $id: string; supporter_count?: number }> }).documents?.[0];

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const supportId = supportDocumentId(issue.$id, userId);
  const supportPayload = {
    issue_id: issue.$id,
    user_id: userId,
    kind: "support",
    note: null,
  };

  const supportDoc = await createDocument(appwriteDatabaseId, appwriteSupportsCollectionId, supportId, supportPayload).catch((error) => {
    if (error instanceof Error && error.message.toLowerCase().includes("already exists")) {
      return null;
    }
    throw error;
  });

  const nextSupportCount = supportDoc ? (issue.supporter_count ?? 0) + 1 : issue.supporter_count ?? 0;

  if (supportDoc) {
    await updateDocument(appwriteDatabaseId, appwriteIssuesCollectionId, issue.$id, {
      supporter_count: nextSupportCount,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true, supportCount: nextSupportCount, alreadySupported: !supportDoc });
}
