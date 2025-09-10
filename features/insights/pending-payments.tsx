import Link from "next/link";

import { Contributor, PaymentMethod, PaymentSchedule } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PendingPayments({
  paymentSchedules,
}: {
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
}) {
  const monthOf = paymentSchedules[0] ? formatDate(paymentSchedules[0].scheduledPaymentDate.toISOString()) : "";

  const pendingPayments = paymentSchedules.filter((p) => p.paymentMethod === PaymentMethod.UNPAID);

  const hasPendingPayments = pendingPayments.length > 0;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Pending Payments</CardTitle>
        <CardDescription>{hasPendingPayments ? `due on ${monthOf}` : ""}</CardDescription>

        {hasPendingPayments ? (
          <CardAction>
            <Button asChild variant="link" size="sm" className="px-0">
              <Link href={`/projects/${pendingPayments[0]?.projectId}?tab=payment-tracking&status=UNPAID`}>
                View All
              </Link>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {hasPendingPayments ? (
          <ul className="space-y-2">
            {pendingPayments.slice(0, 5).map((p) => (
              <li key={p.contributorId}>
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/contributors/${p.contributorId}`} className="group block">
                    <p className="text-sm font-semibold group-hover:underline">{p.contributor.name}</p>
                    <p className="text-muted-foreground text-xs">
                      due on {formatDate(p.scheduledPaymentDate!.toISOString())}
                    </p>
                  </Link>
                  <p className="font-mono text-sm text-red-400">-{formatCurrency(p.contributor.contributionAmount)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground flex h-[200px] flex-col items-center justify-center gap-4 text-center">
            <p>🎉</p>
            <p className="text-sm">No pending payments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
