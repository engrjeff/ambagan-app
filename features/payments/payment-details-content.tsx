import Image from "next/image";

import { Contributor, PaymentSchedule } from "@/app/generated/prisma";
import { PaymentMethodBadge } from "@/components/payment-method-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PaymentDetailsContent({ payment }: { payment: PaymentSchedule & { contributor: Contributor } }) {
  return (
    <div className="px-4">
      <dl className="space-y-3 divide-y divide-dashed">
        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Contributor</p>
          <p className="text-sm font-semibold">{payment.contributor.name}</p>
        </dd>

        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Committed Amount</p>
          <p className="font-mono text-sm font-semibold">{formatCurrency(payment.contributor.contributionAmount)}</p>
        </dd>

        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Amount Paid</p>
          <p className="font-mono text-sm font-semibold text-green-500">+{formatCurrency(payment.actualAmountPaid)}</p>
        </dd>

        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Paid By</p>
          <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
        </dd>

        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Payment Date</p>
          <p className="text-sm font-semibold">
            {payment.paymentDate ? formatDate(payment.paymentDate?.toISOString()) : "--"}
          </p>
        </dd>

        <dd className="pb-3">
          <p className="text-muted-foreground text-xs">Due Date</p>
          <p className="text-sm font-semibold">{formatDate(payment.scheduledPaymentDate.toISOString())}</p>
        </dd>

        {payment.note ? (
          <dd className="pb-3">
            <p className="text-muted-foreground text-xs">Note</p>
            <p className="text-sm">{payment.note}</p>
          </dd>
        ) : null}

        {payment.proofOfPayment ? (
          <dd className="pb-3">
            <p className="text-muted-foreground mb-1 text-xs">Proof of Payment</p>
            <Image
              unoptimized
              src={payment.proofOfPayment}
              width={120}
              height={140}
              alt=""
              className="h-[140px] object-contain object-left hover:opacity-90"
            />
          </dd>
        ) : null}
      </dl>
    </div>
  );
}
