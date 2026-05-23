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
        <div className="space-y-2">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Kranti — People first civic action
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Developed & Maintained by{" "}
            <a
              href="https://www.cit.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 underline underline-offset-2"
            >
              Centre for Information Technology India
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
