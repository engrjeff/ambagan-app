import Image from "next/image";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { Contributor, ContributorStatus, PaymentSchedule } from "@/app/generated/prisma";
import { PaymentMethodBadge } from "@/components/payment-method-badge";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PaymentDetailsContent({ payment }: { payment: PaymentSchedule & { contributor: Contributor } }) {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <dl className="space-y-2 divide-y divide-dashed">
        <dd className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">Contributor</p>
            {payment.contributor.status === ContributorStatus.ACTIVE ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                <CheckCircleIcon className="mr-1 h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                <XCircleIcon className="mr-1 h-3 w-3" />
                Inactive
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold">{payment.contributor.name}</p>
        </dd>

        <dd className="pb-2">
          <p className="text-muted-foreground text-xs">Committed Amount</p>
          <p className="font-mono text-sm font-semibold">{formatCurrency(payment.contributor.contributionAmount)}</p>
        </dd>

        <dd className="pb-2">
          <p className="text-muted-foreground text-xs">Amount Paid</p>
          <p className="font-mono text-sm font-semibold text-green-500">+{formatCurrency(payment.actualAmountPaid)}</p>
        </dd>

        <dd className="pb-2">
          <p className="text-muted-foreground text-xs">Paid By</p>
          <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
        </dd>

        <dd className="pb-2">
          <p className="text-muted-foreground text-xs">Payment Date</p>
          <p className="text-sm font-semibold">
            {payment.paymentDate ? formatDate(payment.paymentDate?.toISOString()) : "--"}
          </p>
        </dd>

        <dd className="pb-2">
          <p className="text-muted-foreground text-xs">Due Date</p>
          <p className="text-sm font-semibold">{formatDate(payment.scheduledPaymentDate.toISOString())}</p>
        </dd>

        {payment.note ? (
          <dd className="pb-2">
            <p className="text-muted-foreground text-xs">Note</p>
            <p className="text-sm">{payment.note}</p>
          </dd>
        ) : null}

        {payment.proofOfPayment ? (
          <dd className="pb-2">
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
