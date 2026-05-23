"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  FileSpreadsheet,
  Search,
  Clock,
  ArrowRight,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronDown
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteGuides } from "@/lib/site-content";

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredGuides = siteGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyTemplate = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy template:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-amber-100/25 blur-3xl dark:bg-amber-900/10" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-10">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <Badge variant="outline" className="border-slate-900/10 bg-white/80 px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Citizen Education Library
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Grievance & Escalation Guides</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Practical legal blueprints and draft templates empowering Indian citizens to pursue accountability from public and private institutions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides, templates, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-full border border-slate-900/10 bg-white/90 shadow-sm focus:border-slate-950/20 focus:outline-none dark:border-white/10 dark:bg-slate-900/90 dark:text-white"
          />
        </div>

        {/* Guides List */}
        <div className="space-y-6">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide) => {
              const isExpanded = activeGuideId === guide.id;
              return (
                <Card
                  key={guide.id}
                  className="border-slate-900/10 bg-white/90 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden"
                >
                  <CardHeader className="p-6 md:p-8 cursor-pointer" onClick={() => setActiveGuideId(isExpanded ? null : guide.id)}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/20 text-xs font-semibold rounded-full px-2.5 py-0.5 uppercase">
                            {guide.category}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.timeToRead}
                          </span>
                        </div>
                        <CardTitle className="text-2xl font-semibold leading-tight text-slate-900 dark:text-white group-hover:text-black">
                          {guide.title}
                        </CardTitle>
                        <CardDescription className="text-base text-slate-600 dark:text-slate-350 pt-1">
                          {guide.summary}
                        </CardDescription>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full shrink-0 h-10 w-10 border transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-slate-100 dark:bg-slate-800' : ''}`}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-t border-slate-900/5 bg-slate-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-slate-950/20">
                          {/* Render content as markdown elements */}
                          <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-8 text-slate-700 dark:text-slate-300 space-y-4">
                            {guide.content.split("\n\n").map((para, idx) => {
                              if (para.startsWith("###")) {
                                return (
                                  <h3 key={idx} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">
                                    {para.replace("###", "").trim()}
                                  </h3>
                                );
                              }
                              if (para.startsWith("*") || para.startsWith("-")) {
                                return (
                                  <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                                    {para.split("\n").map((li, lidx) => (
                                      <li key={lidx}>{li.replace(/^[\*\-\s]+/, "").trim()}</li>
                                    ))}
                                  </ul>
                                );
                              }
                              if (para.startsWith("1.") || para.match(/^\d+\./)) {
                                return (
                                  <ol key={idx} className="list-decimal pl-6 space-y-2 my-4">
                                    {para.split("\n").map((li, lidx) => (
                                      <li key={lidx}>{li.replace(/^\d+[\.\s]+/, "").trim()}</li>
                                    ))}
                                  </ol>
                                );
                              }
                              // Basic HTML link translation
                              const mdLinkMatch = para.match(/\[([^\]]+)\]\(([^)]+)\)/);
                              if (mdLinkMatch) {
                                const parts = para.split(mdLinkMatch[0]);
                                return (
                                  <p key={idx}>
                                    {parts[0]}
                                    <a 
                                      href={mdLinkMatch[2]} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-amber-700 underline underline-offset-4 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 inline-flex items-center gap-0.5"
                                    >
                                      {mdLinkMatch[1]}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                    {parts[1]}
                                  </p>
                                );
                              }
                              return <p key={idx}>{para.trim()}</p>;
                            })}
                          </div>

                          {/* Action Bar inside Expanded view */}
                          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-900/5 pt-6 dark:border-white/5">
                            <Button
                              variant="outline"
                              onClick={() => handleCopyTemplate(guide.id, guide.content)}
                              className="rounded-full gap-2 h-10 px-4 border-slate-900/10 bg-white dark:border-white/10 dark:bg-slate-900"
                            >
                              {copiedId === guide.id ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-600" />
                                  <span>Template Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 text-slate-500" />
                                  <span>Copy Application Template</span>
                                </>
                              )}
                            </Button>
                            
                            <a 
                              href={guide.id === "rti-guide" ? "https://rtionline.gov.in/" : "https://pgportal.gov.in/"} 
                              target="_blank" 
                              rel="noreferrer"
                            >
                              <Button className="rounded-full gap-1.5 h-10 px-4 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                                Open Official Portal
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500">
              No guides match your search query. Try searching for "RTI" or "Consumer".
            </div>
          )}
        </div>

        {/* Footer Support Notice */}
        <div className="rounded-3xl border border-dashed border-slate-900/20 bg-white/50 p-6 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/30 dark:text-slate-400 leading-relaxed">
          💡 <strong>Need evidence collection advice?</strong> Download our verified field-photo guidelines for local issues to ensure submissions protect witness faces and avoid defamation liabilities.
        </div>

      </div>
    </div>
  );
}
