import { PaymentMethod } from "@/app/generated/prisma";
import { FaviconImage } from "./favicon-image";
import { Badge } from "./ui/badge";

export function PaymentMethodBadge({ paymentMethod }: { paymentMethod: PaymentMethod }) {
  if (paymentMethod === PaymentMethod.UNPAID)
    return (
      <Badge variant="outline" className="gap-1.5 rounded-full">
        <span className="size-1.5 rounded-full bg-red-500" aria-hidden="true"></span> Unpaid
      </Badge>
    );

  if (paymentMethod === PaymentMethod.CASH)
    return (
      <Badge variant="outline" className="gap-1.5 rounded-full">
        <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true"></span> Cash
      </Badge>
    );

  if (paymentMethod === PaymentMethod.BANK_TRANSFER)
    return (
      <Badge variant="outline" className="gap-1.5 rounded-full">
        <span className="size-1.5 rounded-full bg-yellow-500" aria-hidden="true"></span> Bank
      </Badge>
    );

  if (paymentMethod === PaymentMethod.GCASH)
    return (
      <Badge variant="outline" className="rounded-full px-1">
        <FaviconImage url="https://new.gcash.com/" size={12} /> GCash
      </Badge>
    );

  return <div>PaymentMethodBadge</div>;
}
