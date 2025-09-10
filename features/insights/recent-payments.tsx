import Link from "next/link";
import { isBefore } from "date-fns";
import { ChevronRightIcon, PackageIcon } from "lucide-react";

import { Contributor, PaymentMethod, PaymentSchedule } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentDetailsContent } from "../payments/payment-details-content";

export function RecentPayments({
  paymentSchedules,
}: {
  paymentSchedules: Array<PaymentSchedule & { contributor: Contributor }>;
}) {
  const monthOf = paymentSchedules[0]
    ? formatDate(paymentSchedules[0].scheduledPaymentDate.toISOString())
    : "No payments made yet";

  const recentPayments = paymentSchedules
    .filter((p) => p.paymentMethod !== PaymentMethod.UNPAID)
    .sort((a, b) => (isBefore(a.paymentDate!, b.paymentDate!) ? 1 : -1));

  const hasRecentPayments = recentPayments.length > 0;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>{hasRecentPayments ? `for ${monthOf}` : ""}</CardDescription>
        {hasRecentPayments ? (
          <CardAction>
            <Button asChild variant="link" size="sm" className="p-0">
              <Link href={`/projects/${recentPayments[0]?.projectId}?tab=payment-tracking&sort=paymentDate&order=desc`}>
                View All
              </Link>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        {hasRecentPayments ? (
          <ul className="space-y-2">
            {recentPayments.slice(0, 5).map((payment) => (
              <li key={payment.contributorId} className="mx-4">
                <RecentPaymentItem payment={payment} />
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

function RecentPaymentItem({ payment }: { payment: PaymentSchedule & { contributor: Contributor } }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="group hover:bg-accent flex cursor-pointer items-center gap-4 rounded-md px-2 py-0.5">
          <div>
            <p className="text-sm font-semibold">{payment.contributor.name}</p>
            <p className="text-muted-foreground text-xs">{formatDate(payment.paymentDate!.toISOString())}</p>
          </div>
          <p className="ml-auto font-mono text-sm text-green-500">+{formatCurrency(payment.actualAmountPaid)}</p>
          <ChevronRightIcon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>Showing the payment details of {payment.contributor.name}</SheetDescription>
        </SheetHeader>

        <PaymentDetailsContent payment={payment} />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
