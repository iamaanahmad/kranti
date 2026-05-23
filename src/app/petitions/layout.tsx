import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign Online Petitions in India",
  description:
    "Browse and sign citizen-led petitions demanding lawful action from government authorities, ministries, and public institutions across India. Make your voice count.",
  keywords: [
    "online petition India",
    "sign petition India",
    "citizen petition India",
    "demand justice India",
    "policy change petition",
    "minister petition India",
  ],
  alternates: {
    canonical: "/petitions",
  },
  openGraph: {
    title: "Sign Online Petitions in India | Kranti",
    description:
      "Demand lawful action from authorities. Browse and sign citizen-led petitions across India.",
    url: `${SITE_URL}/petitions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Online Petitions in India | Kranti",
    description: "Demand lawful action. Browse and sign citizen petitions.",
  },
};

export default function PetitionsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Petitions", path: "/petitions" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Petitions — Kranti",
    url: canonical("/petitions"),
    description: "Citizen-led petitions demanding lawful action in India",
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
