import { currentUser, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { appwriteDatabaseId, appwriteUsersCollectionId, upsertDocument } from "@/lib/appwrite";

export const runtime = "nodejs";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unable to load Clerk user" }, { status: 400 });
  }

  const primaryEmail = user.emailAddresses.find((emailAddress) => emailAddress.id === user.primaryEmailAddressId)?.emailAddress ?? null;
  const primaryPhone = user.phoneNumbers.find((phoneNumber) => phoneNumber.id === user.primaryPhoneNumberId)?.phoneNumber ?? null;

  const document = await upsertDocument(appwriteDatabaseId, appwriteUsersCollectionId, user.id, {
    clerk_id: user.id,
    display_name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || primaryEmail || "Kranti user",
    email: primaryEmail,
    phone: primaryPhone,
    avatar_url: user.imageUrl,
    username: user.username,
    role: "citizen",
    verified: Boolean(user.primaryEmailAddressId || user.primaryPhoneNumberId),
    trust_score: 10,
    consent_accepted: true,
    updated_at: new Date().toISOString(),
    created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, userId: user.id, document });
}
