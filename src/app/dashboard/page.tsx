"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users,
  Clock,
  Heart,
  AlertCircle,
  Bell,
  User,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueRecord } from "@/lib/content-types";

const userNotifications: Array<{
  id: string;
  type: string;
  message: string;
  time: string;
  read: boolean;
}> = [];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"raised" | "supported" | "alerts">("raised");
  const [raisedIssues, setRaisedIssues] = useState<IssueRecord[]>([]);
  const [supportedIssues, setSupportedIssues] = useState<IssueRecord[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/dashboard", { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setRaisedIssues(Array.isArray(data?.raisedIssues) ? data.raisedIssues : []);
        setSupportedIssues(Array.isArray(data?.supportedIssues) ? data.supportedIssues : []);
      })
      .catch(() => {
        setRaisedIssues([]);
        setSupportedIssues([]);
      });

    return () => controller.abort();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
          <p className="text-sm text-slate-500">Loading citizen profile...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-emerald-700 bg-emerald-50 border-emerald-250 dark:bg-emerald-950/30 dark:text-emerald-300";
      case "in_progress":
        return "text-amber-700 bg-amber-50 border-amber-250 dark:bg-amber-950/30 dark:text-amber-300";
      case "pending_review":
        return "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:text-slate-350";
      default:
        return "text-rose-700 bg-rose-50 border-rose-250 dark:bg-rose-950/30 dark:text-rose-350";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-200/20 blur-3xl dark:bg-rose-900/10" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-slate-900/10 bg-white/80 px-3 py-1 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Citizen Dashboard
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome back, {user?.firstName || "Aarav"}
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-350">
              Track issues you've raised, monitor ongoing petitions you support, and review moderation notices.
            </p>
          </div>
          <Button 
            onClick={() => router.push("/issue/new")}
            className="rounded-full h-11 px-6 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 flex items-center gap-1.5 self-start shadow-md"
          >
            Create issue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* User Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-400">Profile Authentication</CardDescription>
              <CardTitle className="text-lg font-bold truncate">{user?.primaryEmailAddress?.emailAddress ?? "aarav.sharma@example.in"}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verification Tier</CardDescription>
              <CardTitle className="text-lg font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Phone Verified (Basic)
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-400">Citizen Trust Score</CardDescription>
              <CardTitle className="text-lg font-bold text-emerald-600 dark:text-emerald-400">85 / 100</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Workspace */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Left Column: Interactive tabs & list */}
          <div className="space-y-4">
            {/* Tabs selector */}
            <div className="flex border-b border-slate-900/5 dark:border-white/5 pb-2 gap-4">
              {[
                { id: "raised", label: "My Raised Issues", count: raisedIssues.length, icon: FileText },
                { id: "supported", label: "Backed Petitions", count: supportedIssues.length, icon: Heart },
                { id: "alerts", label: "Moderation Alerts", count: userNotifications.length, icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative pb-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                  }`}
                >
                  <tab.icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                  <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                    {tab.count}
                  </Badge>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab lists */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {activeTab === "raised" && (
                  <motion.div
                    key="raised"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-4"
                  >
                    {raisedIssues.length > 0 ? (
                      raisedIssues.map((issue) => (
                        <div 
                          key={issue.$id}
                          className="flex items-center justify-between gap-4 p-5 rounded-3xl border border-slate-900/5 bg-white/70 dark:border-white/5 dark:bg-slate-900/40"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{issue.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{issue.district}, {issue.state}</span>
                              <span>•</span>
                              <Badge className={`border uppercase text-[9px] font-semibold px-2 py-0 rounded-full ${getStatusBadgeColor(issue.status)}`}>
                                {issue.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                          <Link href={`/issues/${issue.slug}`}>
                            <Button variant="ghost" size="icon" className="rounded-full shrink-0 border border-slate-900/10 dark:border-white/10">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        You have not submitted any issues yet.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "supported" && (
                  <motion.div
                    key="supported"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-4"
                  >
                    {supportedIssues.length > 0 ? (
                      supportedIssues.map((issue) => (
                        <div 
                          key={issue.$id}
                          className="flex items-center justify-between gap-4 p-5 rounded-3xl border border-slate-900/5 bg-white/70 dark:border-white/5 dark:bg-slate-900/40"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{issue.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {issue.supporter_count} total supporters
                              </span>
                              <span>•</span>
                              <Badge className={`border uppercase text-[9px] font-semibold px-2 py-0 rounded-full ${getStatusBadgeColor(issue.status)}`}>
                                {issue.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                          <Link href={`/issues/${issue.slug}`}>
                            <Button variant="ghost" size="icon" className="rounded-full shrink-0 border border-slate-900/10 dark:border-white/10">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        You have not backed any petitions yet.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "alerts" && (
                  <motion.div
                    key="alerts"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-3"
                  >
                    {userNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`flex gap-3 p-4 rounded-2xl border ${
                          notif.read 
                            ? "bg-slate-50 border-slate-900/5 dark:bg-slate-950/20 dark:border-white/5" 
                            : "bg-amber-50/50 border-amber-900/10 dark:bg-amber-950/10 dark:border-amber-950/20"
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          notif.read ? "bg-slate-100 text-slate-500 dark:bg-slate-900" : "bg-amber-100 text-amber-900 dark:bg-amber-950"
                        }`}>
                          {notif.type === "status_change" ? <Clock className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {notif.message}
                          </p>
                          <div className="text-xs text-slate-400">{notif.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Tips & Guides */}
          <div className="space-y-6">
            
            {/* Citizen Action Checklist */}
            <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-lg">Next Civic Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-350">
                <div className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold dark:bg-white/5">1</span>
                  <p>Submit your first issue report and upload clean photographs of the civic neglect.</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold dark:bg-white/5">2</span>
                  <p>Verify your WhatsApp number to unlock petition signing features and priority queues.</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold dark:bg-white/5">3</span>
                  <p>Read our step-by-step CPGRAMS guide to prepare escalations for municipal failures.</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Link Guides */}
            <Card className="border-slate-900/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-lg">Escalation Guides</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/guides" className="flex items-center justify-between p-3 rounded-xl border border-slate-900/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5 text-sm font-semibold">
                  <span>How to File an RTI Application</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/guides" className="flex items-center justify-between p-3 rounded-xl border border-slate-900/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5 text-sm font-semibold">
                  <span>National Consumer Helpline Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
