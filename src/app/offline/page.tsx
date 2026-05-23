import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-6xl">📡</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          You&apos;re offline
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          No internet connection. Some pages you&apos;ve visited before are still available.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Try home page
      </Link>
    </div>
  );
}
