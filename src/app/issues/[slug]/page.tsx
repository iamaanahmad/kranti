import { notFound } from "next/navigation";
import { ArrowUpRight, Clock3, FileText, MapPin, ShieldCheck, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportButton } from "@/components/support-button";
import {
  appwriteDatabaseId,
  appwriteIssuesCollectionId,
  getFileViewUrl,
  listDocuments,
} from "@/lib/appwrite";

type IssueEvidence = {
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
  publicUrl?: string;
  sanitized?: boolean;
};

type IssueRecord = {
  $id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  state: string;
  district: string;
  landmark: string;
  status: string;
  supportCount?: number;
  evidence?: IssueEvidence[];
  createdAt?: string;
  creatorName?: string;
  language?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function IssueDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const response = await listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, [`equal("slug", ["${slug}"])`, "limit(1)"]);
  const issue = (response as { documents?: IssueRecord[] }).documents?.[0];

  if (!issue) {
    notFound();
  }

  const evidence = issue.evidence ?? [];
  const supportCount = issue.supportCount ?? 0;

  return (
    <div className="bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            Issue detail
          </Badge>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{issue.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 dark:bg-white/5">
                  <MapPin className="h-3.5 w-3.5" />
                  {issue.district}, {issue.state}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 dark:bg-white/5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "Just now"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 dark:bg-white/5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {issue.status}
                </span>
              </div>
            </div>

            <SupportButton slug={issue.slug} initialSupportCount={supportCount} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-900/10 bg-white/90 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-slate-900/10 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <FileText className="mr-1 h-3.5 w-3.5" />
                Description
              </Badge>
              <CardTitle className="text-2xl">What was reported</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              <p>{issue.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Category</div>
                  <div className="mt-1 font-medium text-slate-950 dark:text-white">{issue.category}</div>
                </div>
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Landmark</div>
                  <div className="mt-1 font-medium text-slate-950 dark:text-white">{issue.landmark}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-900/10 bg-white/90 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                <Video className="mr-1 h-3.5 w-3.5" />
                Evidence gallery
              </Badge>
              <CardTitle className="text-2xl">Files attached to this issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidence.length ? (
                evidence.map((item) => {
                  const publicUrl = item.publicUrl ?? getFileViewUrl("evidence-files", item.fileId);

                  return (
                    <div key={item.fileId} className="overflow-hidden rounded-3xl border border-slate-900/10 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                      {item.mimeType.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={publicUrl} alt={item.name} className="h-64 w-full object-cover" />
                      ) : item.mimeType.startsWith("video/") ? (
                        <video controls src={publicUrl} className="h-64 w-full bg-black object-cover" />
                      ) : (
                        <a href={publicUrl} target="_blank" rel="noreferrer" className="block p-5 text-slate-700 dark:text-slate-200">
                          Open attachment
                          <ArrowUpRight className="ml-1 inline-block h-4 w-4" />
                        </a>
                      )}
                      <div className="border-t border-slate-900/10 p-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                        <div className="font-medium text-slate-950 dark:text-white">{item.name}</div>
                        <div className="mt-1 flex flex-wrap gap-3">
                          <span>{formatBytes(item.size)}</span>
                          <span>{item.sanitized ? "Sanitized" : "Original"}</span>
                          <a href={publicUrl} target="_blank" rel="noreferrer" className="text-slate-950 underline-offset-4 hover:underline dark:text-white">
                            View file
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-900/10 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  No evidence has been attached yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-900/10 bg-white/90 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
          <CardHeader>
            <CardTitle className="text-2xl">Support snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-sm text-slate-500 dark:text-slate-400">Support count</div>
                <div className="mt-1 text-3xl font-semibold">{supportCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-sm text-slate-500 dark:text-slate-400">Created by</div>
                <div className="mt-1 font-medium">{issue.creatorName ?? "Kranti user"}</div>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-sm text-slate-500 dark:text-slate-400">Language</div>
                <div className="mt-1 font-medium">{issue.language ?? "en"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
