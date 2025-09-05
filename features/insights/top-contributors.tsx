import { PaymentSchedule, Project } from '@/app/generated/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarIcon, PackageIcon } from 'lucide-react';

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
  const totalContributions = topContributors.reduce(
    (total, c) => total + c.totalPaid,
    0
  );

  const percentage = (totalContributions / project.targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground flex items-center gap-2 pb-2">
          <CalendarIcon className="size-3" />{' '}
          <p>
            {formatDate(project.startDate.toISOString())} -{' '}
            {formatDate(project.endDate.toISOString())}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium font-mono">
            Current: {formatCurrency(totalContributions)}
          </p>
          <p className="text-xs font-medium font-mono">
            Target: {formatCurrency(project.targetAmount)}
          </p>
        </div>
        <Progress
          value={percentage}
          className="bg-white/10"
          indicatorColor={project.color}
        />
        <p className="text-xs text-muted-foreground">{percentage}% completed</p>
      </CardContent>

      <Separator />
      {/* top contributors */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {topContributors.length > 0 ? (
            <ul className="space-y-2">
              {topContributors.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(c.contributionAmount)}/monthly
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-500">
                        {formatCurrency(c.totalPaid)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Paid
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground h-[200px] flex gap-4 flex-col items-center justify-center">
              <PackageIcon className="size-5" />
              <p className="text-sm">No payments made yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
