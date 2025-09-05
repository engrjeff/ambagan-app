import {
  Contributor,
  PaymentMethod,
  PaymentSchedule,
} from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export function PendingPayments({
  paymentSchedules,
}: {
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
}) {
  const monthOf = formatDate(
    paymentSchedules[0].scheduledPaymentDate.toISOString()
  );

  const pendingPayments = paymentSchedules.filter(
    (p) => p.paymentMethod === PaymentMethod.UNPAID
  );

  const hasPendingPayments = pendingPayments.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <h2>Pending Payments</h2>
          {hasPendingPayments ? (
            <Button asChild variant="link" size="sm" className="px-0">
              <Link
                href={`/projects/${pendingPayments[0]?.projectId}?tab=payment-tracking&status=UNPAID`}
              >
                View All
              </Link>
            </Button>
          ) : null}
        </CardTitle>
        <CardDescription>due on {monthOf}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasPendingPayments ? (
          <ul className="space-y-2">
            {pendingPayments.slice(0, 5).map((p) => (
              <li key={p.contributorId}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm">
                      {p.contributor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      due {formatDate(p.scheduledPaymentDate!.toISOString())}
                    </p>
                  </div>
                  <p className="text-sm text-red-400">
                    -{formatCurrency(p.contributor.contributionAmount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground h-[200px] flex gap-4 flex-col items-center justify-center">
            <p>🎉</p>
            <p className="text-sm">No pending payments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
