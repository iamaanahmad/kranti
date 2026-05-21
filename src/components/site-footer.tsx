import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900/5 bg-white/50 px-6 py-8 dark:bg-slate-900/50 dark:border-white/5">
      <div className="mx-auto max-w-7xl text-center">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/about">About</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/campaigns">Campaigns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <div className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Kranti — People first civic action</div>
      </div>
    </footer>
  );
}
