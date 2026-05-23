import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Browse Civic Issues Across India",
  description:
    "Discover real civic issues raised by Indian citizens — broken roads, water shortages, sanitation problems, school neglect, and more. Filter by state, district, and category. Support what matters.",
  keywords: [
    "civic issues India",
    "report public problem India",
    "broken road complaint",
    "water supply complaint India",
    "civic problems map India",
    "raise voice India",
  ],
  alternates: {
    canonical: "/issues",
  },
  openGraph: {
    title: "Browse Civic Issues Across India | Kranti",
    description:
      "Real civic issues raised by Indian citizens. Browse by state, district, or category. Support local change.",
    url: `${SITE_URL}/issues`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Civic Issues Across India | Kranti",
    description: "Real civic issues raised by Indian citizens. Filter by state, district, or category.",
  },
};

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Issues", path: "/issues" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Civic Issues — Kranti",
    url: canonical("/issues"),
    description: "Public civic issues raised by Indian citizens",
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
