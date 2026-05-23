import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Kranti — Civic Action Platform for India",
  description:
    "Kranti is a responsible civic action platform built by Centre for Information Technology India. Our mission is evidence-based citizen voice and lawful change.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Kranti — Civic Action Platform for India",
    description: "Our mission, principles, and how Kranti supports citizen voice.",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      {children}
    </>
  );
}
