'use client';

import { Contributor, PaymentSchedule } from '@/app/generated/prisma';
import { PaymentMethodBadge } from '@/components/payment-method-badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatCurrency, formatDate } from '@/lib/utils';

export function PaymentDetails({
  payment,
}: {
  payment: PaymentSchedule & { contributor: Contributor };
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">View</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>
            Showing the payment details of {payment.contributor.name}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <dl className="space-y-3 divide-y divide-dashed">
            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Contributor</p>
              <p className="text-sm font-semibold">
                {payment.contributor.name}
              </p>
            </dd>

            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Committed Amount</p>
              <p className="text-sm font-semibold">
                {formatCurrency(payment.contributor.contributionAmount)}
              </p>
            </dd>

            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Amount Paid</p>
              <p className="text-sm font-semibold text-green-500">
                +{formatCurrency(payment.actualAmountPaid)}
              </p>
            </dd>

            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Paid By</p>
              <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
            </dd>

            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Payment Date</p>
              <p className="text-sm font-semibold">
                {formatDate(payment.paymentDate?.toISOString()!)}
              </p>
            </dd>

            <dd className="pb-3">
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-semibold">
                {formatDate(payment.scheduledPaymentDate.toISOString())}
              </p>
            </dd>

            {payment.note ? (
              <dd className="pb-3">
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="text-sm">{payment.note}</p>
              </dd>
            ) : null}

            {payment.proofOfPayment ? (
              <dd className="pb-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Proof of Payment
                </p>
                <img
                  src={payment.proofOfPayment}
                  width={120}
                  className="object-contain h-[140px] object-left hover:opacity-90"
                />
              </dd>
            ) : null}
          </dl>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
