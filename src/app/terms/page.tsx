import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
          Terms of Service
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Rules for lawful and safe civic action.</h1>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Users must not post threats, incitement, doxxing, or fabricated allegations. Kranti supports lawful reporting, not vigilantism.
          </p>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Platform moderation may remove unsafe or unlawful content and may require additional verification for high-risk public accusations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">What users agree to</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Share truthful information, respect others, and use the platform in a way that supports legitimate civic action.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">What moderation may do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Review, restrict, or remove content that violates safety rules or could put people at risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
