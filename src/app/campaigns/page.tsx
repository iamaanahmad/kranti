import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const campaigns = [
  {
    title: "Justice watch for violence against women",
    description: "Community campaign to track delayed action in sexual violence cases and demand timely institutional response.",
  },
  {
    title: "Zero tolerance for hate violence",
    description: "Local coalitions documenting hate incidents and pushing transparent prosecution updates.",
  },
  {
    title: "Safe streets, safe transport",
    description: "Citizen-led pressure campaign for lighting, patrol, and emergency safety compliance in high-risk zones.",
  },
];

export default function CampaignsPage() {
  return (
    <div className="bg-[#f4f1ea] px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-50 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <Badge variant="outline" className="border-slate-900/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            Campaigns
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Collective pressure for real action.</h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
            Campaigns help people rally around urgent cases and keep institutions accountable in public view.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.title} className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
              <CardHeader>
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{campaign.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">How a campaign grows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                A case starts with one report, gathers support from people who care, and turns into a public record that stays visible until something changes.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-900/10 bg-white/85 dark:border-white/10 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="text-2xl">What campaigns should do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                They should connect people around a shared problem, keep attention on the facts, and help push for lawful action instead of noise.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
