import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import ClerkFallback from "@/components/clerk-fallback";
import AppwriteSync from "@/components/appwrite-sync";
import { CockroachPointer } from "@/components/cockroach-pointer";
import { VisitAudio } from "@/components/visit-audio";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            <ClerkFallback />
            <AppwriteSync />
            <CockroachPointer />
            <VisitAudio />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
