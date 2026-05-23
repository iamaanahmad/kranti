import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create — Issue, Petition, Campaign, or Report",
  description:
    "Choose what to create on Kranti — raise a civic issue, file a petition, launch a campaign, or document an incident with evidence.",
  alternates: { canonical: "/create" },
  // The /create page is a private action funnel — let it be indexed but not too aggressively
  robots: { index: true, follow: true },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
