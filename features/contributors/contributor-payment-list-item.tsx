import { CalendarIcon } from "lucide-react";

import { Contributor, PaymentMethod, PaymentSchedule } from "@/app/generated/prisma";
import { PaymentMethodBadge } from "@/components/payment-method-badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentDetails } from "../payments/payment-details";
import { PaymentFormDialog } from "../payments/payment-form";

export function ContributorPaymentListItem({
  contributor,
  projectTitle,
  payment,
}: {
  contributor: Contributor;
  projectTitle: string;
  payment: PaymentSchedule;
}) {
  return (
    <Card className="py-3">
      <CardHeader className="px-3">
        <PaymentMethodBadge paymentMethod={payment.paymentMethod} />
        <CardTitle className="flex items-center gap-2 text-sm">
          <CalendarIcon className="size-3" /> <span>{formatDate(payment.scheduledPaymentDate.toISOString())}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Amount due <span className="font-mono">{formatCurrency(payment.amountToPay)}</span>
        </CardDescription>
        <CardAction>
          {payment.paymentMethod === PaymentMethod.UNPAID ? (
            <PaymentFormDialog projectName={projectTitle} schedule={payment} contributor={contributor} />
          ) : (
            <PaymentDetails payment={{ ...payment, contributor: contributor }} />
          )}
        </CardAction>
      </CardHeader>
    </Card>
  );
}
