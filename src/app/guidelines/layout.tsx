import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "Rules for responsible civic participation on Kranti. What's allowed, what's prohibited, and how to engage constructively.",
  alternates: { canonical: "/guidelines" },
  openGraph: {
    title: "Community Guidelines | Kranti",
    description: "Rules for responsible civic participation on Kranti.",
    url: `${SITE_URL}/guidelines`,
  },
};

export default function GuidelinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Community Guidelines", path: "/guidelines" },
        ])}
      />
      {children}
    </>
  );
}
