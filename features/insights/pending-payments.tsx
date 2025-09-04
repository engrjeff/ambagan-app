import {
  Contributor,
  PaymentMethod,
  PaymentSchedule,
} from '@/app/generated/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

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
        <CardTitle>Pending Payments</CardTitle>
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
