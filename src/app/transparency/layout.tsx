import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Transparency Dashboard — Moderation & Funding",
  description:
    "Real-time transparency: moderation statistics, response times, funding details, and a public log of administrative actions on Kranti.",
  alternates: {
    canonical: "/transparency",
  },
  openGraph: {
    title: "Transparency Dashboard | Kranti",
    description: "Moderation statistics, funding, and public action logs.",
    url: `${SITE_URL}/transparency`,
  },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Transparency", path: "/transparency" },
        ])}
      />
      {children}
    </>
  );
}
