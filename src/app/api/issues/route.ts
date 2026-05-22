import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import sharp from "sharp";

import {
  appwriteStorageBucketId,
  appwriteDatabaseId,
  appwriteEvidenceCollectionId,
  appwriteIssuesCollectionId,
  createDocument,
  deleteFile,
  downloadFile,
  getFileViewUrl,
  upsertDocument,
  uploadFileBuffer,
} from "@/lib/appwrite";
import { buildIssueSlug, issueSubmissionSchema } from "@/lib/issue-form";
import { detectEvidenceType } from "@/lib/evidence";

export const runtime = "nodejs";

function safeFileId(seed: string) {
  return seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32) || `file${Date.now()}`;
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unable to load Clerk user" }, { status: 400 });
  }

  const body = (await request.json()) as {
    payload?: unknown;
    evidence?: Array<{
      fileId: string;
      name: string;
      size: number;
      mimeType: string;
      publicUrl?: string;
    }>;
  };

  const submission = issueSubmissionSchema.parse(body.payload);
  const evidenceFiles = Array.isArray(body.evidence) ? body.evidence : [];

  const issueId = `issue${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 32);
  const issueSlug = buildIssueSlug(submission.title);
  const uploadedEvidence = [] as Array<{
    fileId: string;
    name: string;
    size: number;
    mimeType: string;
    publicUrl: string;
    originalFileId?: string;
    sanitized: boolean;
  }>;

  for (const file of evidenceFiles) {
    if (!file.fileId || !file.name || !file.size || !file.mimeType) {
      return NextResponse.json({ error: "Invalid evidence metadata" }, { status: 400 });
    }

    const isImage = file.mimeType.startsWith("image/");
    const publicUrl = file.publicUrl ?? getFileViewUrl(appwriteStorageBucketId, file.fileId);

    if (isImage) {
      const raw = Buffer.from(await downloadFile(appwriteStorageBucketId, file.fileId));
      const sanitizedBuffer = await sharp(raw).rotate().toBuffer();
      const sanitizedFileId = safeFileId(`${file.fileId}-clean`);
      const sanitizedUpload = await uploadFileBuffer(appwriteStorageBucketId, sanitizedFileId, file.name, sanitizedBuffer, file.mimeType);

      await deleteFile(appwriteStorageBucketId, file.fileId).catch(() => {
        // If deleting the raw file fails, keep the sanitized copy and continue.
      });

      uploadedEvidence.push({
        fileId: String((sanitizedUpload as { $id?: unknown }).$id ?? sanitizedFileId),
        originalFileId: file.fileId,
        name: file.name,
        size: sanitizedBuffer.byteLength,
        mimeType: file.mimeType,
        publicUrl: getFileViewUrl(appwriteStorageBucketId, sanitizedFileId),
        sanitized: true,
      });
      continue;
    }

    uploadedEvidence.push({
      fileId: file.fileId,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      publicUrl,
      sanitized: false,
    });
  }

  const issueDocument = await upsertDocument(appwriteDatabaseId, appwriteIssuesCollectionId, issueId, {
    clerkUserId: clerkUser.id,
    createdBy: clerkUser.id,
    title: submission.title,
    slug: issueSlug,
    description: submission.description,
    category: submission.category,
    state: submission.state,
    district: submission.district,
    landmark: submission.landmark,
    evidenceLevel: submission.evidenceLevel,
    language: submission.language,
    status: "pending_review",
    supportCount: 0,
    riskScore: submission.evidenceLevel === "high" ? 20 : submission.evidenceLevel === "medium" ? 40 : 60,
    evidenceCount: uploadedEvidence.length,
    evidence: uploadedEvidence,
    moderationState: "queued",
    virusScanStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || "Kranti user",
  });

  for (const evidenceItem of uploadedEvidence) {
    const evidenceId = `evidence${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 32);
    void createDocument(appwriteDatabaseId, appwriteEvidenceCollectionId, evidenceId, {
      issueId,
      fileId: evidenceItem.fileId,
      originalFileId: evidenceItem.originalFileId ?? null,
      type: detectEvidenceType(evidenceItem.mimeType),
      fileName: evidenceItem.name,
      fileSize: evidenceItem.size,
      publicUrl: evidenceItem.publicUrl,
      sanitized: evidenceItem.sanitized,
      verified: false,
      createdAt: new Date().toISOString(),
    }).catch(() => {
      // Evidence doc persistence should not fail the whole issue submit if storage already succeeded.
    });
  }

  return NextResponse.json({
    ok: true,
    issueId,
    issueSlug,
    issueDocument,
    uploadedEvidence,
  });
}
