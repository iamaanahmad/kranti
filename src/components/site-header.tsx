"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/issues", label: "Issues" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const showSignedInActions = isLoaded && isSignedIn;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-[#f4f1ea]/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden">
            <Image src="/kranti.png" alt="Kranti" width={36} height={36} className="block h-9 w-9 object-contain" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">Kranti</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">People first civic action</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto whitespace-nowrap md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={active ? "secondary" : "ghost"} size="sm" className="whitespace-nowrap">
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {showSignedInActions ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                className="rounded-full bg-slate-950 px-4 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                onClick={() => router.push("/issue/new")}
              >
                Raise voice
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/sign-in")}>
                Log in
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-slate-950 px-4 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                onClick={() => router.push("/sign-up")}
              >
                Join Kranti
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
