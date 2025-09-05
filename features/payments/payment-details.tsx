"use client";

import { Contributor, PaymentSchedule } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
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
import { PaymentDetailsContent } from "./payment-details-content";

export function PaymentDetails({ payment }: { payment: PaymentSchedule & { contributor: Contributor } }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">View</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>Showing the payment details of {payment.contributor.name}</SheetDescription>
        </SheetHeader>

        <PaymentDetailsContent payment={payment} />

        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
