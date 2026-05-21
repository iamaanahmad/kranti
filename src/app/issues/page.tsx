import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const issueTracks = [
  "Injustice by public or private institutions",
  "Hate incidents and targeted abuse",
  "Rape and sexual violence case support",
  "Unsafe public infrastructure and civic neglect",
];

export default function IssuesPage() {
  return (
    <div className="bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            Issues
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Public issues citizens are raising.</h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
            Use this space to discover active cases, support local reports, and follow updates as campaigns push for accountability. Each issue should stay factual, clear, and rooted in lived experience.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {issueTracks.map((track) => (
            <Card key={track} className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
              <CardHeader>
                <CardTitle className="text-xl">{track}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Case listing with status and supporter updates will appear here.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl">What people usually add</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              A short timeline, where it happened, who was affected, and any safe supporting material that helps others understand the case.
            </p>
          </CardContent>
        </Card>

        <Link href="/issue/new">
          <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Raise a new issue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
