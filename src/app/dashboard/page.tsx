"use client";

import { useUser } from "@clerk/nextjs";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  {
    icon: FileText,
    title: "My Issues",
    text: "Track the drafts and cases you have created or supported.",
  },
  {
    icon: ShieldCheck,
    title: "Verification",
    text: "Complete phone or identity checks when they become necessary for trust tiers.",
  },
  {
    icon: Activity,
    title: "Notifications",
    text: "Get updates when moderators move your submission or when a public issue changes status.",
  },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] dark:bg-slate-950">
        <div className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="outline" className="border-slate-900/10 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Citizen dashboard
            </Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Welcome{user?.firstName ? `, ${user.firstName}` : ""}.</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              This is the starting point for your verified civic activity, supports, and moderation-aware notifications.
            </p>
          </div>
          <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Create issue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Profile status", user?.primaryEmailAddress?.emailAddress ?? "No email linked"],
            ["Verification", "Basic"],
            ["Language", "English"],
          ].map(([label, value]) => (
            <Card key={label} className="border-slate-900/10 bg-white/85 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-900/10 bg-white/85 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                <Users className="mr-1 h-3.5 w-3.5" />
                Activity
              </Badge>
              <CardTitle className="text-2xl">Your civic workspace</CardTitle>
              <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">
                When the data layer is connected, this section will surface your issues, supported issues, and status changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium text-slate-950 dark:text-white">{item.title}</div>
                      <div className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-900/10 bg-white/85 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-slate-900/10 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Next steps
              </Badge>
              <CardTitle className="text-2xl">What you can do next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <p>1. Create your first issue draft and attach evidence.</p>
              <p>2. Complete any trust checks that your issue category requires later.</p>
              <p>3. Follow moderation feedback and track the public timeline.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
