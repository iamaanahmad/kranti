import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citizen Guides — RTI, FIR, Consumer Rights & Escalation",
  description:
    "Free, practical guides for Indian citizens: How to file RTI, FIR, consumer complaints, CPGRAMS grievances, and escalate civic issues. Written by legal experts, updated 2025.",
  keywords: [
    "RTI application India",
    "how to file FIR India",
    "consumer complaint India",
    "CPGRAMS grievance portal",
    "civic rights India",
    "citizen guide India",
    "RTI template",
    "consumer court India",
  ],
  openGraph: {
    title: "Citizen Guides — RTI, FIR, Consumer Rights | Kranti",
    description:
      "Free step-by-step guides for Indian citizens on RTI, FIR, consumer complaints, and civic escalation.",
    url: "https://kranti.org.in/guides",
    type: "website",
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Citizen Guides — Kranti",
            description: "Practical legal guides for Indian citizens on RTI, FIR, consumer rights, and civic escalation",
            url: "https://kranti.org.in/guides",
            numberOfItems: 5,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "HowTo",
                  name: "How to File an RTI Application in India",
                  description: "Step-by-step guide to filing Right to Information requests with templates",
                  url: "https://kranti.org.in/guides#rti-guide",
                  totalTime: "PT30M",
                  estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "10" },
                },
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "HowTo",
                  name: "How to File an FIR in India",
                  description: "Your legal rights and the complete FIR filing process including Zero FIR",
                  url: "https://kranti.org.in/guides#fir-guide",
                  totalTime: "PT20M",
                  estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
                },
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "HowTo",
                  name: "How to File a Consumer Complaint in India",
                  description: "NCH, e-Daakhil portal, and Consumer Court process explained",
                  url: "https://kranti.org.in/guides#consumer-complaint-guide",
                  totalTime: "PT25M",
                },
              },
              {
                "@type": "ListItem",
                position: 4,
                item: {
                  "@type": "HowTo",
                  name: "How to Lodge a Grievance on CPGRAMS",
                  description: "File complaints with Central Government ministries online",
                  url: "https://kranti.org.in/guides#cpgrams-guide",
                  totalTime: "PT15M",
                },
              },
              {
                "@type": "ListItem",
                position: 5,
                item: {
                  "@type": "HowTo",
                  name: "How to Collect and Preserve Evidence",
                  description: "Practical guide to documenting civic issues, injuries, and digital evidence",
                  url: "https://kranti.org.in/guides#evidence-collection-guide",
                  totalTime: "PT20M",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
