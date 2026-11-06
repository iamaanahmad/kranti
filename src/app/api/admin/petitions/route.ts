import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  AppwriteRequestError,
  appwriteDatabaseId,
  appwriteModerationLogsCollectionId,
  appwritePetitionsCollectionId,
  createDocument,
  getDocument,
  listDocuments,
  Query,
  updateDocument,
} from "@/lib/appwrite";
import { getUserRole } from "@/lib/role-lookup";
import { verifiedPrimaryEmailForAccount } from "@/lib/account-sync";
import { readJsonWithLimit, RequestBodyTooLargeError } from "@/lib/limited-json";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

async function reviewerId(): Promise<{ userId: string | null; status: number }> {
  let userId: string | null;
  try {
    ({ userId } = await auth());
  } catch {
    return { userId: null, status: 503 };
  }
  if (!userId) return { userId: null, status: 401 };
  try {
    const role = await getUserRole(userId, null, undefined, async () => {
      const user = await currentUser();
      if (!user) throw new Error("Clerk user unavailable");
      return verifiedPrimaryEmailForAccount(user, userId);
    });
    return { userId: role === "admin" || role === "moderator" ? userId : null, status: 403 };
  } catch {
    return { userId: null, status: 503 };
  }
}

function denied(status: number) {
  return NextResponse.json({ error: status === 401 ? "Unauthorized" : status === 403 ? "Forbidden" : "Unable to check reviewer access. Please try again." }, { status });
}

export async function GET(request: Request) {
  const reviewer = await reviewerId();
  if (!reviewer.userId) return denied(reviewer.status);
  const rawOffset = new URL(request.url).searchParams.get("offset") ?? "0";
  if (!/^(0|[1-9]\d*)$/.test(rawOffset) || Number(rawOffset) > 10000) {
    return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  }
  try {
    const response = await listDocuments(appwriteDatabaseId, appwritePetitionsCollectionId, [
      Query.equal("status", ["pending_review"]), Query.orderDesc("created_at"),
      Query.limit(26), Query.offset(Number(rawOffset)),
    ]);
    const documents = (response as { documents?: Array<Record<string, unknown>> }).documents ?? [];
    return NextResponse.json({
      petitions: documents.slice(0, 25).map((document) => ({
        $id: document.$id,
        slug: document.slug,
        title: document.title,
        description: document.description,
        demand: document.demand,
        targetAuthority: document.target_authority,
        category: document.category,
        state: document.state,
        district: document.district,
        createdAt: document.created_at,
      })),
      hasMore: documents.length > 25,
    });
  } catch (error) {
    console.error("Petition review queue failed:", error instanceof AppwriteRequestError ? `Appwrite status ${error.status}` : "Unexpected error");
    return NextResponse.json({ error: "Petition reviews could not load. Please try again." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const reviewer = await reviewerId();
  if (!reviewer.userId) return denied(reviewer.status);
  let body: { petitionId?: unknown; action?: unknown; reason?: unknown };
  try {
    body = await readJsonWithLimit(request, 16 * 1024) as typeof body;
  } catch (error) {
    return NextResponse.json({ error: error instanceof RequestBodyTooLargeError ? "Review details are too large." : "Invalid JSON body" }, { status: error instanceof RequestBodyTooLargeError ? 413 : 400 });
  }
  const { petitionId, action, reason } = body ?? {};
  if (typeof petitionId !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(petitionId)
    || (action !== "approve" && action !== "reject") || (reason !== undefined && typeof reason !== "string")) {
    return NextResponse.json({ error: "Invalid petition review" }, { status: 400 });
  }
  if (action === "reject" && (!reason || !reason.trim())) {
    return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
  }
  let petition: Record<string, unknown>;
  try {
    petition = await getDocument(appwriteDatabaseId, appwritePetitionsCollectionId, petitionId) as Record<string, unknown>;
  } catch (error) {
    console.error("Petition review read failed:", error instanceof AppwriteRequestError ? `Appwrite status ${error.status}` : "Unexpected error");
    return NextResponse.json({ error: "Could not confirm the petition status. Refresh before trying again." }, { status: 503 });
  }
  if (petition.status !== "pending_review") {
    return NextResponse.json({ error: "This petition is no longer awaiting review. Refresh the list." }, { status: 409 });
  }
  const newStatus = action === "approve" ? "open" : "rejected";
  try {
    await updateDocument(appwriteDatabaseId, appwritePetitionsCollectionId, petitionId, { status: newStatus });
  } catch (error) {
    console.error("Petition review update failed:", error instanceof AppwriteRequestError ? `Appwrite status ${error.status}` : "Unexpected error");
    return NextResponse.json({ error: "Could not confirm the review. Refresh before trying again." }, { status: 503 });
  }
  const logId = `log${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.slice(0, 32);
  try {
    await createDocument(appwriteDatabaseId, appwriteModerationLogsCollectionId, logId, {
      action, admin_id: reviewer.userId, content_id: petitionId,
      reason: `Petition review: ${String(reason || (action === "approve" ? "Approved after review." : "Rejected after review.")).trim()}`,
    });
  } catch (error) {
    console.error("Petition review audit failed:", error instanceof AppwriteRequestError ? `Appwrite status ${error.status}` : "Unexpected error");
    return NextResponse.json({ error: "The petition status may have changed, but its review record is unconfirmed. Ask an administrator to check before trying again." }, { status: 503 });
  }
  let notificationSaved: boolean | null = null;
  if (typeof petition.created_by === "string" && petition.created_by) {
    try {
      notificationSaved = await createNotification({
        userId: petition.created_by, type: "moderation", title: "Petition review updated",
        message: `Your petition status is now ${newStatus}.`,
        link: typeof petition.slug === "string" ? `/petitions/${encodeURIComponent(petition.slug)}` : undefined,
      });
    } catch {
      notificationSaved = false;
      console.error("Petition review alert failed");
    }
  }
  return NextResponse.json({ ok: true, petitionId, newStatus, notificationSaved });
}
