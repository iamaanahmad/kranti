import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900/5 bg-white/50 px-6 py-8 dark:bg-slate-900/50 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-2 text-center sm:px-0">
        <nav className="mb-4 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link href="/about">About</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/campaigns">Campaigns</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/transparency">Transparency</Link>
          <Link href="/guidelines">Moderation Policy</Link>
          <Link href="/admin">Admin Panel</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <div className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Kranti — People first civic action</div>
      </div>
    </footer>
  );
}
