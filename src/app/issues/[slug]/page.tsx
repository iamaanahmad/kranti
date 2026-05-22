import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Video,
  FileSpreadsheet,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Scale,
  BookOpen,
  CheckCircle2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SupportButton } from "@/components/support-button";
import IssueComments from "@/components/issue-comments";
import { ShareButtons } from "@/components/share-buttons";
import {
  appwriteDatabaseId,
  appwriteIssuesCollectionId,
  getFileViewUrl,
  listDocuments,
} from "@/lib/appwrite";
import { mockIssues, mockComments, IssueRecord } from "@/lib/mock-data";

type IssueEvidence = {
  fileId: string;
  name: string;
  size: number;
  mimeType: string;
  publicUrl?: string;
  sanitized?: boolean;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Helper to determine status order
const statusSteps = [
  { key: "pending_review", label: "Submitted", desc: "Report registered in queue." },
  { key: "open", label: "Approved / Open", desc: "Factual accuracy verified." },
  { key: "in_progress", label: "In Progress", desc: "Escalated & support active." },
  { key: "resolved", label: "Resolved", desc: "Audited & closed." }
];

export default async function IssueDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let issue: IssueRecord | null = null;

  try {
    // 1. Try to fetch from remote Appwrite
    const response = await listDocuments(appwriteDatabaseId, appwriteIssuesCollectionId, [
      `equal("slug", ["${slug}"])`,
      "limit(1)"
    ]);
    const doc = (response as { documents?: any[] }).documents?.[0];
    if (doc) {
      // Map Appwrite record fields to our standard schema if needed
      issue = {
        $id: doc.$id,
        title: doc.title,
        slug: doc.slug,
        description: doc.description,
        category: doc.category,
        state: doc.state,
        district: doc.district,
        landmark: doc.landmark ?? "Local area",
        status: doc.status,
        supporter_count: doc.supporter_count ?? doc.supportCount ?? 0,
        evidence_count: doc.evidence_count ?? doc.evidenceCount ?? 0,
        created_by: doc.created_by ?? doc.createdBy ?? "unknown",
        creatorName: doc.creatorName ?? "Citizen Reporter",
        language: doc.language ?? "en",
        location: doc.location ?? [78.9629, 20.5937],
        createdAt: doc.createdAt ?? doc.$createdAt ?? new Date().toISOString(),
        evidence: doc.evidence ?? []
      };
    }
  } catch (err) {
    console.warn("Appwrite lookup failed, using local mock data fallback:", err);
  }

  // 2. Fallback to mock data if Appwrite is unavailable or document not found
  if (!issue) {
    const mockMatch = mockIssues.find(i => i.slug === slug);
    if (mockMatch) {
      issue = mockMatch;
    }
  }

  if (!issue) {
    notFound();
  }

  const evidence = issue.evidence ?? [];
  const supportCount = issue.supporter_count ?? 0;
  
  // Filter comments for this issue
  const comments = mockComments.filter(c => c.issue_id === issue?.$id && c.status === "approved");

  // Determine current timeline step index
  const currentStepIndex = statusSteps.findIndex(s => s.key === issue?.status);
  const activeStep = currentStepIndex !== -1 ? currentStepIndex : 0;

  return (
    <div className="relative min-h-screen bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-[500px] w-[500px] rounded-full bg-rose-100/20 blur-3xl dark:bg-rose-900/5" />
        <div className="absolute right-10 bottom-10 h-[400px] w-[400px] rounded-full bg-sky-100/20 blur-3xl dark:bg-sky-900/5" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8">
        {/* Back Link */}
        <Link href="/issues" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Issues
        </Link>

        {/* Page Title Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
              Issue Report
            </Badge>
            <Badge className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 uppercase text-xs rounded-full px-2.5 py-0.5">
              {issue.category}
            </Badge>
          </div>
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl max-w-4xl leading-tight">
                {issue.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-900/5 px-3.5 py-1 dark:bg-white/5 dark:border-white/5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  {issue.district}, {issue.state}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-900/5 px-3.5 py-1 dark:bg-white/5 dark:border-white/5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {new Date(issue.createdAt).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-900/5 px-3.5 py-1 dark:bg-white/5 dark:border-white/5 font-semibold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Status: {issue.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <ShareButtons title={issue.title} slug={issue.slug} />
              <SupportButton slug={issue.slug} initialSupportCount={supportCount} />
            </div>
          </div>
        </div>

        {/* Timeline Progress Bar Tracker */}
        <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-500" />
              Civic Tracking Timeline
            </h3>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
              {/* Connector line for large screens */}
              <div className="absolute top-5 left-8 right-8 hidden md:block h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${(activeStep / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              {statusSteps.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;
                
                return (
                  <div key={step.key} className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-2 flex-1 w-full">
                    {/* Circle Indicator */}
                    <div 
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : isActive 
                            ? "bg-white border-emerald-500 text-emerald-600 dark:bg-slate-900" 
                            : "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className={`font-semibold text-sm ${isActive ? "text-emerald-600 font-bold" : "text-slate-900 dark:text-slate-200"}`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-slate-500 max-w-[150px] md:mx-auto">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Core Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Left Column: Details & Escalation */}
          <div className="space-y-6">
            
            {/* Description Card */}
            <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-xl">Report Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="text-base whitespace-pre-line">{issue.description}</p>
                
                <div className="grid gap-3 sm:grid-cols-2 pt-4 border-t border-slate-900/5 dark:border-white/5">
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Landmark / Location Detail</div>
                    <div className="mt-1 font-medium text-slate-900 dark:text-white">{issue.landmark}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reporter Profile</div>
                    <div className="mt-1 font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-slate-200 overflow-hidden dark:bg-slate-800 shrink-0">
                        {issue.creatorAvatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={issue.creatorAvatar} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      {issue.creatorName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Civic Escalation & Resources */}
            <Card className="border-amber-900/10 bg-amber-50/40 shadow-sm dark:border-amber-950/20 dark:bg-amber-950/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-xl">Lawful Civic Escalation Pathways</CardTitle>
                </div>
                <CardDescription>
                  Under India's civic governance framework, citizens can pursue these actionable pathways for immediate resolution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* RTI Card */}
                  <div className="flex flex-col p-5 rounded-2xl border border-amber-900/10 bg-white/80 dark:border-amber-900/20 dark:bg-slate-900/90 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        <BookOpen className="h-4.5 w-4.5" />
                      </span>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Draft RTI Application</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">
                      Download pre-formatted draft queries specific to road, water, or safety issues to submit to your Public Information Officer (PIO).
                    </p>
                    <Link href="/guides" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
                      View RTI Guide
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Public Grievance Card */}
                  <div className="flex flex-col p-5 rounded-2xl border border-amber-900/10 bg-white/80 dark:border-amber-900/20 dark:bg-slate-900/90 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        <FileSpreadsheet className="h-4.5 w-4.5" />
                      </span>
                      <h4 className="font-semibold text-slate-900 dark:text-white">CPGRAMS Grievance</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">
                      Submit direct complaints to Central/State departments (pgportal.gov.in) with 30-day mandate timelines.
                    </p>
                    <a 
                      href="https://pgportal.gov.in/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Visit pgportal.gov.in
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <CardContent className="p-6 md:p-8">
                <IssueComments issueId={issue.$id} initialComments={comments} />
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Evidence Gallery */}
          <div className="space-y-6">
            
            {/* Evidence Card */}
            <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-xl">Evidence Gallery ({evidence.length})</CardTitle>
                </div>
                <CardDescription>
                  Verified files uploaded by the citizen. Sensitive metadata has been stripped for safety.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {evidence.length > 0 ? (
                  evidence.map((item) => {
                    const isImg = item.mimeType.startsWith("image/");
                    const isVid = item.mimeType.startsWith("video/");
                    return (
                      <div 
                        key={item.fileId} 
                        className="overflow-hidden rounded-2xl border border-slate-900/5 bg-slate-50 dark:border-white/5 dark:bg-slate-950/40"
                      >
                        {isImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={item.publicUrl} 
                            alt={item.name} 
                            className="h-56 w-full object-cover border-b border-slate-900/5 dark:border-white/5" 
                          />
                        ) : isVid ? (
                          <video 
                            controls 
                            src={item.publicUrl} 
                            className="h-56 w-full bg-black object-cover border-b border-slate-900/5 dark:border-white/5" 
                          />
                        ) : (
                          <div className="flex h-36 items-center justify-center bg-slate-100 dark:bg-slate-800 border-b border-slate-900/5 dark:border-white/5">
                            <FileText className="h-10 w-10 text-slate-400" />
                          </div>
                        )}
                        
                        <div className="p-4 space-y-2">
                          <div className="font-semibold text-sm truncate">{item.name}</div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Size: {formatBytes(item.size)}</span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Metadata Cleansed
                            </span>
                          </div>
                          <a 
                            href={item.publicUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="mt-2 block w-full py-2 rounded-xl text-center border border-slate-900/10 text-xs font-semibold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                          >
                            View Original File &rarr;
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-900/10 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/20">
                    No evidence has been attached.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legal compliance note */}
            <div className="rounded-2xl border border-slate-950/5 bg-slate-950/5 p-5 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400 leading-relaxed space-y-2">
              <div className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                DPDP & Legal Compliance
              </div>
              <p>
                Kranti handles data under the Digital Personal Data Protection (DPDP) Act, 2023. Supporting documents undergo automated EXIF metadata purging to remove GPS, camera models, and private author tags before hosting.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
