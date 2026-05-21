import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kranti",
    template: "%s | Kranti",
  },
  description:
    "Citizen platform to raise voice against injustice and organize lawful public action in India.",
  keywords: [
    "Kranti",
    "civic action",
    "India",
    "justice",
    "campaign",
    "public accountability",
    "citizen voice",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ClerkProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ClerkProvider>
      </body>
    </html>
  );
}
