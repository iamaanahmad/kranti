import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Civic Campaigns & Movements Across India",
  description:
    "Join citizen campaigns for environment, road safety, education reform, women's safety, and more. Volunteer, organise, and drive systemic change in India.",
  keywords: [
    "civic campaign India",
    "social movement India",
    "volunteer civic India",
    "citizen campaign",
    "environmental campaign India",
    "education reform India",
  ],
  alternates: {
    canonical: "/campaigns",
  },
  openGraph: {
    title: "Civic Campaigns & Movements Across India | Kranti",
    description:
      "Join citizen-led campaigns for systemic change across India. Volunteer, organise, and act.",
    url: `${SITE_URL}/campaigns`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Civic Campaigns Across India | Kranti",
    description: "Join citizen-led movements for real change.",
  },
};

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaigns" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Campaigns — Kranti",
    url: canonical("/campaigns"),
    description: "Citizen-led civic campaigns across India",
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Kranti" },
    inLanguage: ["en-IN", "hi-IN"],
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={collectionSchema} />
      {children}
    </>
  );
}
