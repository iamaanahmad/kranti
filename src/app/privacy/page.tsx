import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
          Privacy Policy
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Privacy and survivor safety come first.</h1>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Kranti limits public exposure of personal data and applies strict handling for sensitive reports, especially where sexual violence or targeted hate is involved.
          </p>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Personal details are collected only when required for lawful processing, moderation, and communication about a case.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">What we avoid sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Unnecessary personal details, unsafe identifiers, and anything that could place a survivor or witness at risk.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">How reports are handled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Reports can be reviewed, moderated, and restricted before they become public so that the platform stays safer for everyone involved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
