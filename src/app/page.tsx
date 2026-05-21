"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Megaphone,
  Scale,
  ShieldAlert,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const focusAreas = [
  {
    icon: ShieldAlert,
    title: "Injustice reporting",
    text: "Raise cases where institutions fail to respond, services collapse, or rights are denied.",
  },
  {
    icon: AlertTriangle,
    title: "Hate incidents",
    text: "Report communal hate, targeted abuse, and threats so communities can document and respond lawfully.",
  },
  {
    icon: HeartHandshake,
    title: "Sexual violence support",
    text: "Share rape and sexual violence case details responsibly, with survivor safety and legal escalation in mind.",
  },
];

const actionFlow = [
  {
    icon: FileText,
    title: "Report the case",
    text: "Submit clear details, location, timeline, and any supporting material available.",
  },
  {
    icon: Users,
    title: "Build public support",
    text: "Others can back the case and help keep pressure on relevant authorities.",
  },
  {
    icon: Scale,
    title: "Push for accountability",
    text: "Move toward lawful escalation, official complaints, and transparent public tracking.",
  },
];

const liveCampaigns = [
  "Safe transport routes for women in tier-2 cities",
  "Fast-track action against repeat hate offenders",
  "Public hospital dignity and emergency response audits",
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f4f1ea] text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-200/35 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute right-0 top-20 h-96 w-96 translate-x-1/3 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-900/20" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/25 blur-3xl dark:bg-sky-900/20" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-14 pt-14 lg:px-8 lg:pt-20">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-5 border-slate-900/10 bg-white/80 px-3 py-1 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Megaphone className="mr-1 h-3.5 w-3.5" />
              Raise your voice. Demand justice.
            </Badge>

            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Kranti is for citizens who refuse silence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Kranti gives people a public way to report serious problems, gather support, and keep attention on the cases that need action. The goal is simple: make it easier for communities to speak clearly and be heard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                onClick={() => router.push("/issue/new")}
              >
                Raise voice now
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-full" onClick={() => router.push("/campaigns")}>
                View campaigns
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <Card className="border-slate-900/10 bg-white/90 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900/70">
              <CardHeader>
                <Badge variant="outline" className="w-fit border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  Active now
                </Badge>
                <CardTitle className="text-2xl">Citizen priorities this week</CardTitle>
                <CardDescription className="text-base">
                  Stronger action on hate crimes, faster response for sexual violence cases, and accountability for unsafe public spaces.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveCampaigns.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {focusAreas.map((item) => (
            <Card key={item.title} className="border-slate-900/10 bg-white/85 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <item.icon className="h-5 w-5" />
                </span>
                <CardTitle className="mt-3 text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">{item.text}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">How Kranti works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">From a single report to collective public pressure.</h2>
            <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-300">
              The platform keeps the process straightforward: explain what happened, add details that matter, and let supporters help carry the case forward.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {actionFlow.map((step) => (
              <Card key={step.title} className="border-slate-900/10 bg-white/85 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/5">
                <CardHeader>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">{step.text}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
