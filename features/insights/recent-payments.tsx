import {
  Contributor,
  PaymentMethod,
  PaymentSchedule,
} from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { isBefore } from 'date-fns';
import { PackageIcon } from 'lucide-react';
import Link from 'next/link';

export function RecentPayments({
  paymentSchedules,
}: {
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
}) {
  const monthOf = paymentSchedules[0]
    ? formatDate(paymentSchedules[0].scheduledPaymentDate.toISOString())
    : 'No payments made yet';

  const recentPayments = paymentSchedules
    .filter((p) => p.paymentMethod !== PaymentMethod.UNPAID)
    .sort((a, b) => (isBefore(a.paymentDate!, b.paymentDate!) ? 1 : -1));

  const hasRecentPayments = recentPayments.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>for {monthOf}</CardDescription>
        {hasRecentPayments ? (
          <CardAction>
            <Button asChild variant="link" size="sm" className="p-0">
              <Link
                href={`/projects/${recentPayments[0]?.projectId}?tab=payment-tracking&sort=paymentDate&order=desc`}
              >
                View All
              </Link>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {hasRecentPayments ? (
          <ul className="space-y-2">
            {recentPayments.slice(0, 5).map((p) => (
              <li key={p.contributorId}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm">
                      {p.contributor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.paymentDate!.toISOString())}
                    </p>
                  </div>
                  <p className="text-sm text-green-500">
                    +{formatCurrency(p.actualAmountPaid)}
                  </p>
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
      </CardContent>
    </Card>
  );
}
