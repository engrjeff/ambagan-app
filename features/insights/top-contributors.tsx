import Link from "next/link";
import { CalendarIcon, PackageIcon } from "lucide-react";

import { PaymentSchedule, Project } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TopContributors({
  project,
  topContributors,
}: {
  project: Project & { paymentSchedules: PaymentSchedule[] };
  topContributors: Array<{
    id: string;
    name: string;
    totalPaid: number;
    contributionAmount: number;
  }>;
}) {
  const totalContributions = topContributors.reduce((total, c) => total + c.totalPaid, 0);

  const percentage = (totalContributions / project.targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{project.title}</CardTitle>
        <CardDescription className="line-clamp-1">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 pb-2 text-xs">
          <CalendarIcon className="size-3" />{" "}
          <p>
            {formatDate(project.startDate.toISOString())} - {formatDate(project.endDate.toISOString())}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-xs font-medium">Current: {formatCurrency(totalContributions)}</p>
          <p className="font-mono text-xs font-medium">Target: {formatCurrency(project.targetAmount)}</p>
        </div>
        <Progress value={percentage} className="bg-white/10" indicatorColor={project.color} />
        <p className="text-muted-foreground text-xs">{percentage.toFixed(1)}% completed</p>
      </CardContent>

      <Separator />
      {/* top contributors */}
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>

        <CardAction>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href={`/projects/${project.id}?tab=contributors`}>View All</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {topContributors.length > 0 ? (
          <ul className="space-y-2">
            {topContributors.slice(0, 5).map((c) => (
              <li key={c.id}>
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/contributors/${c.id}`} className="group block">
                    <p className="text-sm font-semibold group-hover:underline">{c.name}</p>
                    <p className="text-muted-foreground text-xs">
                      <span className="font-mono">{formatCurrency(c.contributionAmount)}</span> / month
                    </p>
                  </Link>
                  <div>
                    <p className="font-mono text-sm text-green-500">{formatCurrency(c.totalPaid)}</p>
                    <p className="text-muted-foreground text-right text-xs">Total Paid</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground flex h-[200px] flex-col items-center justify-center gap-4 text-center">
            <PackageIcon className="size-5" />
            <p className="text-sm">No payments made yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
